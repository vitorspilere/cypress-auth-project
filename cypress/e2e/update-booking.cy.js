/// <reference types="cypress"/>

//teste

describe ('Update Booking', () => {

    const bodyLogin = {
        "username" : "admin",
        "password" : "password123"
    }

    const bodyPost = {
        "firstname": "Vitor",
        "lastname": "Lamarque",
        "totalprice": 2000,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2025-08-26",
            "checkout": "2025-08-28"
        },
        "additionalneeds": "Breakfast"
    }

    const bodyUpdate = {
        "firstname": "Vitor",
        "lastname": "Lamarque",
        "totalprice": 8000,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2025-08-26",
            "checkout": "2025-08-28"
        },
        "additionalneeds": "Breakfast"
    }

    var token = ''
    var bookingId = ''

    before('Login', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: bodyLogin
        }).then((response) => {
            expect(response.status).to.equal(200)
            token = response.body.token
        })
    })

    beforeEach('Create booking',() => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: bodyPost
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.bookingid).to.be.a('number')
            expect(response.body.booking.totalprice).to.equal(2000)
            bookingId = response.body.bookingid
        })
    })
    
    it('Update Booking', () => {
        console.log(token)
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            body: bodyUpdate,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': 'token=' + token
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.totalprice).to.equal(8000)
            expect(response.body.bookingdates.checkin).to.equal('2025-08-26')
            expect(response.body.bookingdates.checkout).to.equal('2025-08-28')
        })
    })

    it('Update Booking without token', () => {
        console.log(token)
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            failOnStatusCode: false,
            body: bodyUpdate,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //'Cookie': 'token=' + token
            }
        })
    })

    it('Update Booking with invalid token', () => {
        console.log(token)
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            failOnStatusCode: false,
            body: bodyUpdate,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': 'token=123456'
            }
        })
    })
}) 