# Welcome to the Curriculum checker 

To run please run docker first with the following command:  
```bash
docker-compose up --build
```  
then it will automatically run djangos `python manage.py runserver` through the help of docker  

to fetch the endpoints follow the following in the hosted API:  
#### Login:  
```
https://curriculum-checker.onrender.com/accounts/api/login/
```
#### Signup:  
```
https://curriculum-checker.onrender.com/accounts/api/signup/
```

To fetch the following on local development:
#### Login:  
```http://localhost:8000/accounts/api/login/```  
#### Signup:  
```http://localhost:8000/accounts/api/signup/```  
example json format for login and signup:  
```json
{
    "username": "testinglang2",
    "password": "tumetesting2"
}
```

to fetch the endpoints for editing and create and delete:  
#### Create, Put(edit), Delete API for hosted API:  
```https://curriculum-checker.onrender.com/api/students/```  
#### Create, Put(edit), Delete API for non-hosted API:  
```http://localhost:8000/api/students/```  

example json:  
```json
    {
        "id": 2,
        "student_id": "23-22-209",
        "student_name": "khristoferson",
        "student_section": "IT-21",
        "professor_name": "REJAN TADEO",
        "prelims": "89",
        "midterms": "89",
        "semifinals": "89",
        "finals": "89",
        "gwa": "69"
    },
```
