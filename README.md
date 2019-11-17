# email-service-api
**REST**ful Email service API that integrates with multiple email service providers to send emails.

This API utilises two email service providers `MailGun` and `SendGrid`, if one of the services fails, the API will continue to call the same service up to 6 times, using an exponential backoff. Once the maximum retries have been exceeded, the API fails-over to the next service provider and repeats the same process. At the moment only two email service providers have been implemented, however more can be added.

The API should always be **UP** and should not crash.

> As you need to setup a domain and DNS records usually to send to any email address, I have not gone down this path, but have created a test email address to which this email service can send emails to.

## Test email credentials
------
The credentials to the email address are 
```
u/n: emailsvc2019@gmail.com
p/w: Test1234%
```

## Installation/Start-Up
------
To install, please run the following command from the `email-service-api` directory
```
yarn
```

Ensure you set the three envvironment variables required, before startup
```
MAILGUN_USER=<MailGun_User>
MAILGUN_APIKEY=<MailGun_APIkey>
SENDGRID_APIKEY=<SendGrid_APIKey>
```

Once the environment variables are set, start the API
```
yarn start
```


## Testing
To test, please run the following command from the `email-service-api` directory
```
yarn test
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

The API is running on heroku and can be reached at this address, to service requests.
```
https://evening-retreat-38182.herokuapp.com
``` 
