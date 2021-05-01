terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# Create VPC
resource "aws_vpc" "remote_distro_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "remote_distro_vpc"
  }
}

# Create Subnet
resource "aws_subnet" "remote_distro_subnet" {
  vpc_id            = aws_vpc.remote_distro_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "remote_distro_subnet"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "remote_distro_gw" {
  vpc_id = aws_vpc.remote_distro_vpc.id

  tags = {
    Name = "remote_distro_gw"
  }
}

# Create Route Table
resource "aws_route_table" "remote_distro_route_table" {
  vpc_id = aws_vpc.remote_distro_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.remote_distro_gw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.remote_distro_gw.id
  }

  tags = {
    Name = "remote_distro_route_table"
  }
}

# Route the public subnet traffic through the IGW
resource "aws_route" "internet_gateway_route" {
  route_table_id         = aws_route_table.remote_distro_route_table.id
  gateway_id             = aws_internet_gateway.remote_distro_gw.id
  destination_cidr_block = "0.0.0.0/0"
}

# Create Route Table Association
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.remote_distro_subnet.id
  route_table_id = aws_route_table.remote_distro_route_table.id
  count          = 2
}

# Security group for the ECS cluster 
resource "aws_security_group" "ecs_security_group" {
  name   = "fargate-security-group"
  vpc_id = aws_vpc.remote_distro_vpc.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "remote_distro_security_group" {
  name   = "remote-distro-security-group"
  vpc_id = aws_vpc.remote_distro_vpc.id

  ingress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS 
resource "aws_ecs_cluster" "main" {
  name               = "remote-distro-cluster"
  capacity_providers = ["FARGATE_SPOT"]
}

resource "aws_ecs_task_definition" "remote_distro_backend" {
  family                   = "remote-distro-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"

  execution_role_arn = var.execution_role_arn

  container_definitions = <<DEFINITION
[
  {
    "name": "remote_distro_backend", 
    "image": "${var.remote_distro_backend_docker}", 
    "portMappings": [
        {
          "hostPort": 80,
          "protocol": "tcp",
          "containerPort": 80
        },
        {
          "hostPort": 443,
          "protocol": "tcp",
          "containerPort": 443
        }
    ],
    "environment": [
      {
        "name": "PORT",
        "value": "8080"
      },
      {
        "name": "NODE_ENV",
        "value": "production"
      },
      {
        "name": "REDBIRD_PORT",
        "value": "80"
      },
      {
        "name": "AWS_ACCESS_KEY_ID",
        "value": "${var.aws_access_key}"
      },
      {
        "name": "AWS_SECRET_ACCESS_KEY",
        "value": "${var.aws_secret_key}"
      },
      {
        "name": "AWS_REGION",
        "value": "${var.aws_region}"
      },
      {
        "name": "BASE_DOMAIN",
        "value": "${var.public_domain}"
      }
    ],
    "essential": true,
    "entryPoint": [], 
    "command": [],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/fargate/service/remote-distro",
        "awslogs-region": "${var.aws_region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]
DEFINITION
}

resource "aws_ecs_task_definition" "ubuntu-xfce" {
  family                   = "ubuntu-xfce"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.distro_cpu
  memory                   = var.distro_memory

  execution_role_arn = var.execution_role_arn

  container_definitions = <<DEFINITION
[
  {
    "name": "ubuntu-xfce",
    "image": "${var.remote_ubuntu_xfce_docker}",
    "portMappings": [
      {
        "hostPort": 6080,
        "protocol": "tcp",
        "containerPort": 6080
      }
    ],
    "essential": true, 
    "entryPoint": [], 
    "command": [],
    "environment": [
      {
        "name": "VNC_SCREEN_SIZE",
        "value": "1366x768"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_task_definition" "arch-i3" {
  family                   = "arch-i3"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.distro_cpu
  memory                   = var.distro_memory

  execution_role_arn = var.execution_role_arn

  container_definitions = <<DEFINITION
[
  {
    "name": "arch-i3",
    "image": "${var.remote_arch_i3_docker}",
    "portMappings": [
      {
        "hostPort": 6080,
        "protocol": "tcp",
        "containerPort": 6080
      }
    ],
    "essential": true, 
    "entryPoint": [], 
    "command": [],
    "environment": [
      {
        "name": "VNC_SCREEN_SIZE",
        "value": "1366x768"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_task_definition" "kali-xfce" {
  family                   = "kali-xfce"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.distro_cpu
  memory                   = var.distro_memory

  execution_role_arn = var.execution_role_arn

  container_definitions = <<DEFINITION
[
  {
    "name": "kali-xfce",
    "image": "${var.remote_kali_xfce_docker}",
    "portMappings": [
      {
        "hostPort": 6080,
        "protocol": "tcp",
        "containerPort": 6080
      }
    ],
    "essential": true, 
    "entryPoint": [], 
    "command": [],
    "environment": [
      {
        "name": "VNC_SCREEN_SIZE",
        "value": "1366x768"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_service" "backend-service" {
  name                  = "backend-service"
  cluster               = aws_ecs_cluster.main.id
  task_definition       = aws_ecs_task_definition.remote_distro_backend.arn
  desired_count         = 1
  launch_type           = "FARGATE"
  wait_for_steady_state = true

  network_configuration {
    security_groups  = [aws_security_group.ecs_security_group.id]
    subnets          = [aws_subnet.remote_distro_subnet.id]
    assign_public_ip = true
  }

  tags = {
    "Name" = "Remote Browser Backend"
  }
}

data "aws_route53_zone" "zone_1" {
  name = var.base_domain
}

resource "aws_route53_record" "remote_distro_backend" {
  zone_id = data.aws_route53_zone.zone_1.zone_id
  name    = "*.${var.public_domain}"
  type    = "A"
  ttl     = "300"
  records = [local.backend_ip]
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "/fargate/service/remote-distro"
  retention_in_days = var.logs_retention_in_days
}

data "aws_network_interface" "remote_distro_nic" {
  depends_on = [aws_ecs_service.backend-service]
  filter {
    name   = "group-id"
    values = [aws_security_group.ecs_security_group.id]
  }
}

output "public_ip" {
  description = "Public IP for remote distro backend"
  value       = "http://${local.backend_ip}"
}

output "public_domain" {
  description = "Domain for remote distro backend"
  value       = "http://${var.public_domain}"
}

locals {
  backend_ip = data.aws_network_interface.remote_distro_nic.association.*.public_ip[0]
}
