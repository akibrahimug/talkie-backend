resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.elastic_ip.id
  subnet_id     = aws_subnet.public_subnet_a.id

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-nat-gw" })
  )
}

# I have only created one nat gateway since its a paid for resource but We need two
# We also need a second elastic_ip instance
