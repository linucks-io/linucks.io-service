[![Issues][issues-shield]][issues-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/csivitu/Template">
    <img src="https://i.ibb.co/41wHGgQ/logo.png"  alt="Logo" width="80">
  </a>

  <h1 align="center">linucks.io-service</h1>

  <p align="center">
    The backend repo for linucks.io ✨:sparkles:
    <br />
    <a href="https://github.com/csivitu/Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://linucks-io.github.io/linucks.io-client/">View Demo</a>
    ·
    <a href="https://github.com/linucks-io/linucks.io-service/issues">Report Bug</a>
    ·
    <a href="https://github.com/linucks-io/linucks.io-service/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contributors](#contributors-)



<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
  <a href="https://linucks-io.github.io/linucks.io-client">
    <img src="https://i.ibb.co/VQgK4HL/1.png"  alt="product">
    <img src="https://i.ibb.co/JQWpLGG/2.png"  alt="product1">
  </a>
  <p align="center">


Check out a live demo [here](https://linucks-io.github.io/linucks.io-client/).


**linucks.io** is a web application where you can test out a range of Linux distros before actually installing in on your system.


Linux is a popular kernel which is used mainly by developers because of the many benefits. Since there are a number of flavours of GNU/Linux, there
are many options to choose from, which can be quite confusing for the user.

**linucks.io** is a one-stop solution for distro-hopping. With this application, we try the user by simulating a virtual environment of the distro of the user's choice. This is the repository for the frontend of the web-application, you can check out the frontend on [https://github.com/linucks-io/linucks.io-client/](https://github.com/linucks-io/linucks.io-client/). Every time a user clicks on a distro, a request is sent to the backend, which allocates a docker image for that cluster and returns a SSL encrypted websocket URL for it, which can be accessed using [noVNC](https://github.com/novnc/noVNC) on the browser.


Internally, the backend uses ECS (Elastic Container Service) provided by AWS. Therefore, the environment variables in `sample.env` must be configured with the AWS secrets. Every time a request is made to `/provision`, the backend requests a new task to run in the ECS cluster for the corresponding linux distribution. Once the task is running, the URL is sent back to the frontend, and then is displayed using the `react-vnc` library, which uses the `noVNC` protocol. Each docker image has a VNC server like `x11vnc` or `tigerVNC` running inside it. The ECS infrastructure can be set up using the terraform files provided in the [deployment](./deployment) folder.

Once a task is provided, a dynamic reverse proxy is set up programmatically using [redbird](https://www.npmjs.com/package/redbird), which redirects all websocket requests from the backend to the correct private IP within the ECS cluster. The tasks are cleaned up every 30 minutes.

### Built With

* [express](https://expressjs.com/)
* [aws-sdk](https://aws.amazon.com/tools/)
* [terraform](https://www.terraform.io/)
* [redbird](https://www.npmjs.com/package/redbird)
* [AWS](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?nc2=h_ct&src=header_signup)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* npm
* node
* terraform (CLI)
* AWS Access Key ID and Secret Access Key

### Installation
 
1. Clone the repo
```sh
git clone https://github.com/linucks-io/linucks.io-service.git
```
2. Install NPM packages
```sh
cd server
npm install
```

<!-- USAGE EXAMPLES -->
## Usage

1. The redbird server and the express server start up together using the following command.

```sh
npm start
```

## Deployment

1. The infrastructure can be deployed on terraform using the following command.

```sh
# create a deployment/terraform.tfvars file with vars declared in deployment/variables.tf file
cd deployment
terraform apply --auto-approve
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/linucks-io/linucks.io-service/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.  :smile:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push -u origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[issues-shield]: https://img.shields.io/github/issues/linucks-io/linucks.io-service.svg?style=flat-square
[issues-url]: https://github.com/linucks-io/linucks.io-service/issues
