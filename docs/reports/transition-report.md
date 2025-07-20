# Usefulness and Transition report

## Transcript of the customer meeting

**Team-46**: So, what we did, what already works? We introduced templates for all languages, and we introduced MongoDB. We also added this code button, so it won't be so cryptic for users. 
For just code execution, you should press "Templates." It's basically the same as "Create Template" but available from the main page. We now support three databases: Postgres, Chroma, and MongoDB.
We updated documentation for all languages. We added section for parser that we just integrated. 

Let us show some features we implemented untill now. Firstly we can open the coderunner page and take a look at the hint button. It changes when we change language. 
Like, for MongoDB, it supports different comments, and also you can find documentation. We can even try some commands like db.collection.name. It will show an error: "Unknown query” but we can insert in collections.

**Customer tries the command**:  Oh yeah, "insert" worked.

**Tean-46**: It will be just a collection, parsing as JSON to backend.

**Tean-46**: And Chroma also works. We can make a mistake and see the error from the parser. And we introduced two more commands: UPDATE and DROP. So, we can update files with the given ID. 
And it will update, and we can not just delete one file, we can drop all files.

**Customer tries the command**

**Tean-46**: We can add one file, run this code. We can save a template, enter name and description, and then go to templates. For any language it will be here. 
And user can save unlimited number of its own templates. And also, we can delete a template.

Users can import text from their files. Let’s show it in Chroma. Let’s create a simple .txt file, and… its imported. For PostgreSQL we support .sql files.

We designed an account page, you can see it. Now it can display an actual name and email from the registration form.

And now, until the end of the week we will try to finish classrooms. Templates and code runner finished, account page already designed. Can we meet on Sunday to record final testing? 

**Customer**: Yes

**Team-46**: Okay, then let's switch to the usability and transition part. Is the product complete? Which parts are done and which aren’t done?

**Customer**: According to what I expected, it went over the things that I expected. The templates are done. I would like to have importing data directly, as well as importing text and code. 
The classrooms can be more expanded, but they are done for MVP. There weren't many other functionalities that I wanted to see, and they are not here yet.

**Team-46**: Are you using the product?

**Customer**: For now, no, because actually we talked about it today in the meeting with Nursultan that some products need time to be used. For example, some people are working with stuff related to "doe," and it's not the time for using it.
It's a summer application, so they need the right time to do it. So, I'm definitely going to use the product. Actually, I'm going to use it with two other PhD students to do some research with templates and code for different databases. 
After that, if I'm "alive" in two semesters, I'm going to force it to be used – or rather, ask for it to be used. Maybe we can use it in that space course.

**Team-46**: Have you deployed it on your side?

**Customer**: Not yet. But for me, the most important part is to have it on GitHub. So whenever I want, I can deploy it. We will merge it to your repository, so it's your history to be deployed. 
Since I'm not planning to use it, for example, tomorrow or something, I'm going on vacation from the 26th, so I will not use it until the end of August. 

**Team-46**: What measures need to be taken to fully transition the product?

**Customer**: If I saw the merge conflicts, that's probably the most important part. You can probably separate your backend if it is different from the other team. Is it them to another direction from the other team? 
Okay, so probably you can create another repository, not another directory, for your backend and name it "backend team something." Besides conflicts, there might be lots of bugs that we have never met before. 
I don't know, I will solve them while using it.

**Team-46**: What is your plan for the product after it is delivered? And how are you going to continue working on it? Would you like to collaborate with our team after this course?

**Customer**: It's not a question of whether I want to collaborate. Do you want to collaborate without grades? Yeah, I'm okay with your team. You did a really good job. But I don't know what the plans will be in the future. 
Yeah, but I'm going to expand it, either by me or somebody else, but there's still no plan. But I'm fully satisfied with your team. 

**Team-46**: How to increase the chance that the product will be useful after the final delivery?

**Customer**: Actually, it is useful right now. It is usable. So, after the final review, just transitioning it to the customer makes it useful. There are still some more functionalities that cannot be added on, but if the code is clear and clean – I have seen all the pull requests until three weeks ago – so I can say it is expandable and maintainable. 
I'm not sure about the extra stopper, if you have followed that path, it's going to be easy to expand on it and maintain it.

**Team-46**: So, you do not care about some deploying stuff like Nginx, like microservices, like, maybe an expandable product?

**Customer**: Yeah, actually, they are not really related. Nginx is just a balancer for the product, so it doesn't really matter. You are just exposing your backend and frontend directly. 
We can have one load balancer layer on it, and it doesn't really affect the code. It is just going to be there. About microservices, it is the architecture of a system, and it should be designed from the beginning as microservices.
So, we are going with monolithic architecture, and I'm fine with that. I don't care about them.

**Team-46**: Okay. Now, let us talk about the README file. Have you seen it before, or maybe I'll show it to you? Is it clear? What can be improved? Are the deployment instructions useful? 

**Customer**:  So, probably one part of the documentation can be information about the parser. No, the parser project that has been created alongside this one. And your research about different types of databases, especially ChromaDB. 
How did you achieve and how did you deploy it? How did you achieve your results of research of supporting? Yeah, your deployment and your research. How it works? How should it be merged with our system. 
I mean, there is not much improvement.

**Team-46**: About launch and deployment instructions. Are you able to deploy the product? You can find Docker Compose. 

**Customer**: Yeah, project and deployment instructions. I mean, yes. It's clear. It's pretty smart. So, thank you very much, sure.

## Recording of the customer meeting

[Link to the recording](https://disk.yandex.ru/d/Nn_-Eg6y6QkmCw)

