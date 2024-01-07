resource "aws_launch_configuration" "aws_launch_configuration" {
  name                        = "${local.prefix}-launch_configuration"
  image_id                    = data.aws_ami.ec2_ami.id
  instance_type               = var.ec2_instance_type
  key_name                    = "talkieappKeyPair"
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2_instance_profile.name
  security_groups             = [aws_security_group.autoscaling_group_sg.id]
  user_data                   = filebase64("${path.module}/userdata/user-data.sh")
  lifecycle {
    create_before_destroy = true
  }
}
