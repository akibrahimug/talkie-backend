resource "aws_autoscaling_group" "ec2_autoscaling_group" {
  launch_template {
    id      = aws_launch_template.asg_launch_template.id
    version = "$Latest"
  }
  name                      = "${local.prefix}-ASG"
  vpc_zone_identifier       = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
  max_size                  = 1
  min_size                  = 1
  desired_capacity          = 1
  health_check_type         = "ELB"
  health_check_grace_period = 600
  default_cooldown          = 150
  force_delete              = true
  target_group_arns         = [aws_alb_target_group.server_backend_tg.arn]
  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupTotalInstances"
  ]

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_elasticache_replication_group.talkieapp_redis_cluster]

  tag {
    key                 = "Name"
    value               = "EC2-ASG-${terraform.workspace}"
    propagate_at_launch = true
  }

  tag {
    key                 = "Type"
    value               = "Backend-${terraform.workspace}"
    propagate_at_launch = true
  }
}
