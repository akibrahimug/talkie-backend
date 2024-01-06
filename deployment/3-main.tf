terraform {
  backend "s3" {
    bucket = "talkie-app-terraform-state"
    key = "develop/talkieapp.tfstate"
    region = var.aws_region
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    Project = var.project
    ManagedBy = "Terraform"
    Owner = "Kasoma Ibrahim"
  }
}
