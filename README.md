<div id="top"></div>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/stanleyclaudius/donation-app">
    <img src="client/public/image/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Donation Application</h3>

  <p align="center">
    An awesome donation application based on website
    <br />
    <a href="https://github.com/stanleyclaudius/donation-app"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/stanleyclaudius/donation-app">View Demo</a>
    ·
    <a href="https://github.com/stanleyclaudius/donation-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/stanleyclaudius/donation-app/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

**Donation App** is a web application that the main functionality is to allow their user to create a campaign and donate to it. This website have 3 roles inside it, such as **admin**, **fundraiser**, and **general user**. Each roles can access to different resources that support the main lifecycle of this application.

<p align="right"><a href="#top">back to top</a></p>

### Built With

Main technology used to built this application are listed below:

* [Go](https://www.go.dev/)
* [Gin](https://www.gin-gonic.com/)
* [Docker](https://www.docker.com/)
* [Typescript](https://www.typescriptlang.org/)
* [React.js](https://www.reactjs.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [Tailwind CSS](https://www.tailwindcss.com/)

<p align="right"><a href="#top">back to top</a></p>

## Getting Started

To get started with this project locally, follow below steps:

### Prerequisites

Make sure you have go, docker, and package manager (either npm or yarn) installed

>**FYI**: This project uses **yarn** as the client package manager, but you're free to use **npm** too.

### Installation

Below steps will guide you through the local installation process of this application

1. Clone the repo
   ```
   git clone https://github.com/stanleyclaudius/donation-app.git
   ```
2. Install client-side dependency<br />
Make sure that your terminal pointing at the root directory of this project (donation-app folder).
   ```
   cd client && yarn install
   ```
3. Spin up Docker, then open up the terminal, and change directory to the server folder, then run below command
   ```
   make postgres && make createdb && make migrateup
   ```
4. Note that, the admin account should be created manually in the database
5. Complete the .env variable<br/>
Rename .env.example file at ```/config``` directory become ```.env```, then fill the value for every key. Below is the guideline for filling the .env value:<br/>
    | Key | What To Fill | Example Value |
    | :---: | :---: | :---: |
    | DB_DRIVER | Your database driver | postgres |
    | DB_SOURCE | Your database source URL | postgresql://root:xxx |
    | SERVER_ADDRESS | Your server address | 0.0.0.0:8080 |
    | TOKEN_SYMMETRIC_KEY | Random 32 characters length string | 7888329xxx |
    | ACCESS_TOKEN_DURATION | Access token duration | 15m |
    | REFRESH_TOKEN_DURATION | Refresh token duration | 24h |
6. Lastly, open 2 terminal at the same time, and run below command at your terminal to spin off the application
    ```
    cd client && yarn start
    ```
    ```
    cd server && make server
    ```

<p align="right"><a href="#top">back to top</a></p>

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right"><a href="#top">back to top</a></p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right"><a href="#top">back to top</a></p>

## Contact

LinkedIn: [Stanley Claudius](https://www.linkedin.com/in/stanley-claudius-4560b21b7)

Project Link: [https://github.com/stanleyclaudius/donation-app](https://github.com/stanleyclaudius/donation-app)

<p align="right"><a href="#top">back to top</a></p>

## Acknowledgments

Special thanks to:

* [Othneildrew](https://github.com/othneildrew/) for providing an amazing README template.
* [Tailwind CSS](https://tailwindcss.com) for providing CSS framework to be used in this application.
* [React Icons](https://react-icons.github.io/react-icons/) for providing icon to be used in this application.

<p align="right"><a href="#top">back to top</a></p>

[forks-shield]: https://img.shields.io/github/forks/stanleyclaudius/donation-app.svg?style=for-the-badge
[forks-url]: https://github.com/stanleyclaudius/donation-app/network/members
[stars-shield]: https://img.shields.io/github/stars/stanleyclaudius/donation-app.svg?style=for-the-badge
[stars-url]: https://github.com/stanleyclaudius/donation-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/stanleyclaudius/donation-app.svg?style=for-the-badge
[issues-url]: https://github.com/stanleyclaudius/donation-app/issues
[license-shield]: https://img.shields.io/github/license/stanleyclaudius/donation-app.svg?style=for-the-badge
[license-url]: https://github.com/stanleyclaudius/donation-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/stanley-claudius-4560b21b7