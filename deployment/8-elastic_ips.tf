resource "aws_eip" "elastic_ip" {
  instance = aws_instance.bastion_host.id
  depends_on = [
    aws_internet_gateway.main_igw
  ]

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-eip" })
  )
}
