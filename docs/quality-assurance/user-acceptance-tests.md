## ``Old`` 
#### **Query processing**
*Given: The user (student or developer) needs to execute some query on the remote DB
When: The user sended the query
Then: The query is processed on the remote DB and result is shown*
User test: On code runner page, you can write a query in the language for a chosen database and press the Run button, you will see the request results in special field. Next, you can test a new feature from PostgresSQL - selecting a user tables - by clicking on the table button, then you should have table schema.  

#### **Main page**
*Given: The user becomes familiar with the service
When: The user first time see the service
Then: The necessary infotmation is placed at the main page, including:
    List of templates
    List of classrooms*
User test: After successful registration, go to the following sections: templates, classroom and profile. All sections can be accessed via the buttons

#### **Multiple Databases**
*Given: The user needs to work with different databases
When: The user send the queries
Then: The user can choose one of several DBs*
User test: A window opens for working with existing templates and the ability to create your own template. If you click on any button to create/use a template, a window will open in which you should first select a database (supported options are Postgres and Chroma). Next, you can write a query.

## ``New``
#### **User Story Registration**
>As a user (student / teacher)
- I want to handle all my workflow onto the server and get access to them by individual passphrase, so that I need to registration functionality.
Acceptance criteria (AC)

*Given: Entering into the service
When: The user comes to service first time and fill out the login data
Then: The registration is processed*
User Test: The user enters the main page of the application -> then he selects the sign in button, after which a modal window opens for login, if you enter the data of an unregistered user, an error will be displayed. Therefore, the next step is to select the registration option on the model window and enter the requested data (name and email are unique for each user, the email must correspond to the standard form and the passwords must match). Next, the user can go to the account tab, where his name will be displayed. The following steps are required to verify registration: 1. In the account tab, click on LogOut and then on the main page of the message with the previously entered name and password.  2. Log in to the admin panel at http://89.169.178.180:8000/admin / enter name: admin, password: admin. Next, go to the Users field in the db structure, where you can see the newly registered user.

#### **User Story Calssrooms**
>As a student,
 - I want to be a member of course, so that classroom page
>As a teacher,
- I want to manage all my course member, so that i need a classroom page
Acceptance criteria (AC)

*Given: The user needs to learn the course
When: The user goes to courses space
Then: The user can become a member of a course (classroom)*
User Story: Without leaving the admin page, the user must go to the Classrooms field and click on the add classroom button. Next, by filling in all the necessary fields, create a class by clicking on the Save button (TA (Teacher Assistant) can only be the user who has the TA role set in the user settings. In order to set it, you need to go to the users field, select the user, and select Teacher Assistant in the role field). After successfully creating the class, open the Enrollment field and create a new Enrollment, where you need to select the user you want to add (for example, add yourself), the class you want to add the user to, and the rating you want to assign to the user. After successfully creating an Enrollment, you can log back in to http://89.169.178.180:3000 / where by updating (or visiting) the class page, you can see the class you just added yourself to.