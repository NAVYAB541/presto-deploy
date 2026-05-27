variable "aws_region" {
  default = "ap-southeast-2"
}

variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type      = string
  sensitive = true
}

variable "instance_type" {
  default = "t2.medium"
}

variable "ami_id" {
  description = "Ubuntu AMI ID"
  type        = string
}

variable "public_ports" {
  type        = list(number)
  default     = [22, 80, 5005, 443, 8080]
}
