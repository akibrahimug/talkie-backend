terraform {
  backend "s3" {
    bucket  = "talkieappserver-terraform-state"
    key     = "staging/talkieapp.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Kasoma Ibrahim"
  }
}
