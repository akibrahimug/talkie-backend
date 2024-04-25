# resource "aws_launch_configuration" "asg_launch_configuration" {
#   name_prefix                 = "${local.prefix}-launch-config"
#   image_id                    = data.aws_ami.ec2_ami.id
#   instance_type               = var.ec2_instance_type
#   key_name                    = "talkieappKeyPair"
#   associate_public_ip_address = true
#   iam_instance_profile        = aws_iam_instance_profile.ec2_instance_profile.name
#   security_groups             = [aws_security_group.autoscaling_group_sg.id]
#   user_data                   = filebase64("${path.module}/userdata/user-data.sh")

#   lifecycle {
#     create_before_destroy = true
#   }
# }


resource "aws_launch_template" "asg_launch_template" {
  name_prefix   = "${local.prefix}-launch-template"
  image_id      = data.aws_ami.ec2_ami.id
  instance_type = var.ec2_instance_type
  key_name      = "talkieappKeyPair"

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.autoscaling_group_sg.id]
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_instance_profile.name
  }

  user_data = base64encode(file("${path.module}/userdata/user-data.sh"))

  lifecycle {
    create_before_destroy = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "Instance launched from ${local.prefix}"
    }
  }

  monitoring {
    enabled = true
  }
}
