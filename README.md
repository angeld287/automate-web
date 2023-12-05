# Automate Web

The automated web project is designed to facilitate the content management process for websites. In the world of SEO, you need to spend a lot of time getting the content, transcribing it, and creating the article with the images in WordPress.


This project has several modules:
- Keyword management module: in this module a process is invoked that searches for keywords based on an idea. These words are obtained from the “Related Searches” sessions of Google search results. From these words, articles are created, with the selected keywords and with the help of GPT open API.
- Content organization module: this module is responsible for managing that the article is unique and copyright-free.
- Image Management Module: as the name says, it is the session where images are added to the paragraphs. In this same session, the article is created in Wordpress.

# Run Application with Docker (PM2)

In this session is explained how to up and down the containers of this application.

```bash
# In the root folder execute:

docker-compose up

# to delete the containers execute:

docker-compose down

```

# Run Application Local without Docker

Below mentioned are the steps to run the application locally.

```bash
#To the server application, in the root folder, execute:

npm run server

#To the client application, in the root folder, execute: 

npm run client

```

# Run Test

Below mentioned are the steps to execute the test for the project.

```bash
#To execute the server tests, in the root folder, execute:

npm run server-test

# or 

npm run server-test-watch 

```
