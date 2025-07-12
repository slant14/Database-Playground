# Database-Playground

![Logo](./docs/logoo.svg)

This is free web-service for learning and testing different types of databases  
Available on http://89.169.178.180:3000/  
[Demo video](https://disk.yandex.com.am/i/3592sfysVX_rSA)  

## Development

[Development documentation](./CONTRIBUTING.md)


---


## Quality characteristics and quality attribute scenarios

[Quality characteristics and quality attribute scenarios documentation](./docs/quality-assurance/quality-attribute-scenarios.md)


---


## Quality assurance
### Automated tests

[Automated tests documentation](./docs/quality-assurance/automated-tests.md)

### User acceptance tests

[User acceptance tests documentation](./docs/quality-assurance/user-acceptance-tests.md)


---


## Build and deployment automation

[Pull request](https://github.com/S25-SWP-Team46/DP-fork/pull/147), where CI/CD can be seen

### Continuous Integration

[Continuous integration documentation](./docs/automation/continuous-integration.md)

### Continuous Deployment

[Continuous deployment documentation](./docs/automation/continuous-delivery.md)

### Manual deployment

To deploy the project locally:  
docker-compose up --build

To deploy the project on the server:  
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000  
docker-compose up  


---


## Architecture

[Architecture documentation](./docs/architecture/architecture.md)


---


## Usage 
### EXISTED USER - w/o admin panel
Go to http://89.169.178.180:3000/ and login with 
Login: 
```
Leonid
```
Password: 
```
123456
```
Then go to 
1) Classrooms -> View
2) Templates -> 
	-> Create Template 
	-> Choose DB... (Postgres or Chroma - check Command Tips in the right bottom section) 
	-> write requests and click Run Code 
	-> check DB changes in real time, check execution measuring in the Request Result field. 


---
### NEW USER - admin usage
#### Registration usability
- Enter the main page of the application ->
	- -> select the ``Sign in`` button -> after which a modal window opens for login (if you enter the data of an unregistered user, an error will be displayed). Therefore, the next step:
		- -> select the registration option on the model window  -> enter the requested data (name and email are unique for each user, the email must correspond to the standard form and the passwords must match). 
- Next -> go to the account tab, where your name will be displayed. The following steps are required to verify registration: 
	1. In the account tab, click on ``Log Out`` then -> on the main page of the message with the previously entered name and password.  
	2. Log in to the admin panel at http://89.169.178.180:8000/admin/ -> enter name: **admin**, password: **admin**. Next -> go to the Users field in the db structure -> you will see the newly registered user.
#### Classroom usability
- Without leaving the admin page -> go to the Classrooms field then -> click on the add classroom button. 
- Next -> fill all the necessary fields -> create a class by clicking on the ``Save button`` **!(TA (Teacher Assistant) can only be the user who has the TA role set in the user settings!**
- In order to set the role -> go to the users field -> select the user -> select Teacher Assistant in the role field). 
- After successfully creating the class -> open the Enrollment field -> create a new Enrollment -> you need to select: 
	- the user you want to add (for example, add yourself)
	- the class you want to add the user to
	- the rating you want to assign to the user.
- After successfully creating an Enrollment -> log back in to http://89.169.178.180:3000/ -> update (or chose) the class page -> you will see the class you just added yourself to.
