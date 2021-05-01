variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "aws_region" {
  type    = string
  default = "ap-southeast-1"
}

variable "remote_arch_i3_docker" {
  type = string
}

variable "remote_ubuntu_xfce_docker" {
  type = string
}

variable "remote_distro_backend_docker" {
  type = string
}

variable "execution_role_arn" {
  type = string
}

variable "distro_cpu" {
  type    = string
  default = "2048"
}

variable "distro_memory" {
  type    = string
  default = "4096"
}

variable "base_domain" {
  type = string
}

variable "public_domain" {
  type = string
}

variable "logs_retention_in_days" {
  type        = number
  default     = 5
  description = "Specifies the number of days you want to retain log events"
}
