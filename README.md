# email-service-api
**REST**ful Email service API that integrates with multiple email service providers to send emails.

> As you need to setup a domain and DNS records usually to send to any email address, I have not gone down this path, but have created a test email address to which this email service can send emails to.

## Test email credentials
------
The credentials to the email address are 
```
u/n: emailsvc2019@gmail.com
p/w: Test1234%
```

## API Guideline
------
To call the API you need to send a JSON `POST` request, with a body that takes the following form below. There is no authentication required to call the `email-service-api`

```json
{
	"to": [
      { "email": "test@gmail.com" }, 
      { "email": "emailsvc2019@gmail.com" }
    ],
    "cc": [
      { "email": "test@gmail.com" }, 
      { "email": "emailsvc2019@gmail.com" }
    ],
    "bcc": [
      { "email": "test@gmail.com" }, 
      { "email": "emailsvc2019@gmail.com" }
    ],
	"content": "This is truly amazing!! 10987"
}
```
The API will provide helpful error messages to guide you as to what your body should include or not include. If you don't need to send emails to BCC recipients, then you shouldn't provide this property, the api will expect that if this property is provided there is at least one email.


## Deployment Details
------

The API is running on heroku and can be reached at this address.
```
https://evening-retreat-38182.herokuapp.com
``` 
