resource "aws_iam_role" "code_deploy_iam_role" {
  name = var.code_deploy_role_name
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = ["codedeploy.amazonaws.com"]
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "AdministratorAccess" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AdministratorAccess"
  role       = aws_iam_role.code_deploy_iam_role.name
}

