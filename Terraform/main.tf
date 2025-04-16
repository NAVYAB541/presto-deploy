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

  # Save PEM locally to Keys folder
  provisioner "local-exec" {
    command = <<-EOT
      echo "xyz" > ${path.module}/../Keys/presto_terraform_key.pem
      chmod 400 ${path.module}/../Keys/presto_terraform_key.pem
    EOT
  }

  # SSH connection and remote execution
  connection {
    type        = "ssh"
    user        = "ec2-user"  # For Amazon Linux AMI
    private_key = tls_private_key.presto_terraform_key.private_key_pem
    host        = self.public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "echo 'Hello from the remote instance!'",
      "sudo yum update -y",  # Example command to run on the instance
      "hostname"             # Another example command
    ]
  }
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