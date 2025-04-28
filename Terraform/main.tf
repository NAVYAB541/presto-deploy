resource "tls_private_key" "presto_terraform_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "presto_terraform_key" {
  key_name   = "terraform-generated-key"
  public_key = tls_private_key.presto_terraform_key.public_key_openssh
}

resource "aws_security_group" "presto_terraform_sg" {
  name        = "presto-terraform-security-group"
  description = "Allow SSH (22), Frontend (80), Backend (5005)"

  dynamic "ingress" {
    for_each = var.public_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "presto_terraform_ec2" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.presto_terraform_key.key_name
  vpc_security_group_ids = [aws_security_group.presto_terraform_sg.id]

  tags = {
    Name = "Presto-Terraform-Server"
  }

  # SSH connection and remote execution
  connection {
    type        = "ssh"
    user        = "ubuntu"  # For Amazon Linux AMI
    private_key = tls_private_key.presto_terraform_key.private_key_pem
    host        = self.public_ip
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      # Install Docker
      "sudo apt-get update -y",
      "echo 'apt-get update -y completed !'",
      "sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "sudo add-apt-repository -y \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "sudo apt-get update -y",
      "sudo apt-get install -y docker-ce",
      "echo 'install -y docker-ce completed !'",
      "sudo usermod -aG docker ubuntu",
      
      # Run Jenkins container
      "sudo docker run -d --name jenkins \\",
      "  --user root \\",
      "  -p 8080:8080 \\",
      "  -p 50000:50000 \\",
      "  -v /var/run/docker.sock:/var/run/docker.sock \\",
      "  -v $(which docker):/usr/bin/docker \\",
      "  -v jenkins_home:/var/jenkins_home \\",
      "  jenkins/jenkins:lts",
      
      "echo 'Run Jenkins containe completed !'",
      # Wait for Jenkins to start
      "sleep 30",  # Give Jenkins time to start
      
      # Get initial admin password
      "echo 'Jenkins initial admin password:'",
      "sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
    ]
  }
}

# Save PEM locally to Keys folder
resource "local_file" "presto_key" {
  content  = tls_private_key.presto_terraform_key.private_key_pem
  filename = "${path.module}/../Keys/presto_terraform_key.pem"
  file_permission = "0400"
}

output "instance_public_ip" {
  value = aws_instance.presto_terraform_ec2.public_ip
}

output "private_key_path" {
  value = "${path.module}/../Keys/presto_terraform_key.pem"
}

output "ssh_command" {
  value = "ssh -i ${path.module}/../Keys/presto_terraform_key.pem ec2-user@${aws_instance.presto_terraform_ec2.public_ip}"
}

output "module_path" {
  value = path.module
}

output "jenkins_url" {
  value = "http://${aws_instance.presto_terraform_ec2.public_ip}:8080"
}