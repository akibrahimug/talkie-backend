//Tools

- Node js with Express and Typescript => Runtime
- MongoDB => Database
- Redis => In memory cache
- Message Queue => Redis based message que
- Terraform => Infrastructure as code tool
- CircleCI => CI/CD platform
- Git => Version Control
- GitHub => Code hosting
- AWS => Cloud computing platform
  -- Compute - EC2 - Elastic Load Balancing
  -- Storage - S3 - CloudFront - Elastic Block Storage
  -- Developer - CodeDeploy
- Banyan => For logging errors in production
- Cloudinary => For deploying images
- Ethereal => Email brocker
- PM2 => Node Process Manager

  //App Features

- Authentication => Using Cookies (JWT)
  Signup
  signIn
  Signout
  Password Reset /Password request
  Current User Check on the frontend to make sure their token allows access

- Chat/Messaging
  Private chat
  Send Images in chat
  Add Message Reactions
  Retrive messages
  Mark as read
  Delete Messages

- User
  Get single user
  Get Multiple users with Pagination
  Select Random user to be followed

- Post
  Create post with and without images
  Get Posts
  Update post
  Edit posts

- Comments
  Add comments
  Get single and multiple comments

- Reactions
  Add Post reaction
  Get single and multiple post reaction
  Remove reaction from post

- Images
  Add Image to post
  Upload profile/background images
  Retrive images
  Delete profile and background image

- Folloewr/Unfollow/Block and Unblock
  Follow User
  Unfollow user
  Block and unblock user

- Notification
  Notification settings
  Retrive and Display notifications
  Delete and update notifications

The app is set up in a way that in future we can use it as a microservice

AWS SERVICES USED

- Virtual Private Cloud (VPC)
  It separates the public cloud(aws) to have a private cloud.
- Subnet
  Allows us to manage internet traffic into our instances
  IP addresses that we can use
- Internet GateWay
  Allows internet into our VPC
- Route Table
  Allow traffic within the VPC
  - Traffic through instances launched from either the private/public subnet
- Elastic IP
  Used with NAT Gateways
  Assign to EC2 instances
- NAT Gateways
  Launched from the public subnets giving access to the private subnets
- Bastion Host
  Allow admin access from the public subnet into the EC2/ElastiCache in the private subnet
- Security groups
  Firewalls for instances
- Application Load Balancers (ALB)
  Used with the Route 53
  Balance the traffic entering into our servers
- Route 53
  Use the nameserves to connect to external domains
- AWS Certificate Manager(ACM)
  Allow the app to only use https
- Auto Scaling Groups (ASG)
  Allows us to scale up or down the instances
- Elastic Compute Cloud (EC2)
  Computer on which the serve is running on in the cloud
- Elasticache
  We are using this to store the redis data
- IAM Roles and Policies
  Access temporaliy
- Simple Storage Service(s3)
  For storage
- CodeDeploy
  If we update our code base in GH this will help keep the app upto date
