import moment from "moment";
import dotenv from 'dotenv';
import { formatDate } from "../util/index.js";
dotenv.config();


const populateMail = (content) => {
    return (
        `
            <html>
                <head>
                    <style>
                        .container {
                            background-color: #134FE7;
                            width: 100%;
                            min-height: 50vh;
                            display: flex;
                            justify-content: center;
                        }
                        
                        .main-content {
                            background-color: #ffffff;
                            width: 50%;
                            margin: 1rem auto;
                            padding: .5rem;
                            min-height: 150px;
                            border-radius: 5px;
                            font-family: Raleway;
                        }
                        
                        .content {
                            padding: 20px 40px;
                        }
                        
                        .btn {
                            background-color: #134FE7;
                            padding: .7rem 0;
                            border-radius: 50px;
                            color: #ffffff;
                            border: none;
                            text-decoration: none;
                            text-align: center;
                            width: 100%;
                        }
                        
                        .header {
                            display: flex;
                            justify-content: center !important;
                            border-bottom: 1px solid #d1d7db;
                            min-height: 50px;
                            padding: 1rem 0;
                        }
                        
                        .title {
                            color: #585858;
                            font-family: Raleway;
                            font-size: 16px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%; /* 24px */
                        }
                        
                        .emailText {
                            color: #55A9F8;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 500;
                        }

                        .linkButton {
                            background: blue !important;
                            padding: 0.5rem 2rem !important;
                            color: white !important;
                            border-radius: 6px !important;
                            text-decoration: none !important;
                            text-align: center !important;
                        }
                        
                        .flex-center {
                            width: 30% !important;
                            margin: 0px auto 0px auto !important;
                        }

                        .flex-between {
                            display: flex !important;
                            justify-content: space-between !important;
                        }
                        
                        .box-container {
                            background: rgb(243, 244, 246) !important; 
                            padding: 10px !important; 
                            border-radius: 8px !important; 
                            min-height: 50px !important; 
                            margin: 5px auto !important;
                        }

                        @media screen and (max-width: 600px) {
                            .main-content {
                                width: 80% !important;
                            }
                            .content {
                                padding: 10px 20px;
                            }
                            .title {
                                font-size: 14px;
                            }
                            .emailText {
                                font-size: 14px;
                            }
                            
                            p {
                                font-size: 11px
                            }
                            
                            table, tr, th, td{
                                font-size: 12px;
                            }

                            .flex-center {
                                width: 50% !important;
                                margin: 0px auto 0px auto !important;
                            }
                        }
                    
                    </style>
                </head>

                <body>
                    <div class="container"
                        style="
                            background-color: #134FE7;
                            width: 100%;
                            min-height: 50vh;
                            display: flex;
                            justify-content: center;
                        "
                    >
                        <div class="main-content">
                        
                            <div class="header" 
                                style="
                                    display: flex;
                                    justify-content: center !important;
                                    border-bottom: 1px solid #d1d7db;
                                    min-height: 50px;
                                    padding: 1rem 0;
                                "
                            >
                                <img src="https://aosl-online.com/static/media/logo-white.db7e14036e9ce6fce09b.png" width="100px" height="40px" alt="logo" style="margin: 0 auto;" />
                            </div>

                            <style>
                                @media (max-width: 600px) {
                                    div[class="main-content"] {
                                        width: 90% !important;
                                        margin: 1rem auto;
                                    }
                                    img[width="100px"]{
                                        width: 60px !important;
                                        height: 30px !important;
                                    }
                                }
                            </style>

                            <div
                                class="content" 
                                style="
                                    padding: 10px 20px;
                                "
                            >
                                ${ content }
                            
                            </div>
                            
                        </div>
                    </div>
                </body>
            </html>
        
        `
    )
}


export const orderEmailTemplate = (order, recipient, isAdmin) => {
    const content = !isAdmin ? 
    `
        <div>
            <p 
                style="
                    color: #585858;
                    font-family: Raleway;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 150%;
                "
            >
                ${ recipient ? 'Hi '  +  recipient.firstName + ' ' + recipient.lastName : 'Dear Customer' }
            </p>
            
            <p 
                style="
                    color: #585858;
                    font-family: Raleway;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 150%;
                "
            >you have successfully created an order with the following details</p>
            
            <div style="margin: 1rem 0 .5rem 0; font-size: 12px;">
            
                <table>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left; font-size: 12px;">Order Code:</th>
                        <td style="font-size: 12px;">${ order ? order.orderCode : '--'}</td>
                    </tr>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    style="font-size: 12px;">
                        <th style="text-align: left; font-size: 12px;">Amount:</th>
                        <td style="font-size: 12px;">${ order ? `$ ${order.amount}` : '--'}</td>
                    </tr>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left; font-size: 12px;">Date/Time:</th>
                        <td style="font-size: 12px;">${ order ? moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss') : '--'}</td>
                    </tr>
                </table>
            </div>
            
            <p style="color: #585858;">You can proceed to invoice page to make payment for your service</p>
            
            <p style="color: #585858;">
                contact us via our email <span 
                style="
                    color: #55A9F8;
                    font-family: Raleway;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    margin: .5rem 0;
                "
            >support@aosl-online.com </span> if you have any issues with this transaction or Click on the link below to chat with our admin
            </p>
            
            <br/>
            
            <div style="display: flex; justify-content: center; width: 100%; margin: .85rem 0;">
                <a href="${`https://aosl-online.com/invoice/${order.orderCode}?gw=ps`}" target="_blank" class="btn" 
                    style="
                        background-color: #134FE7;
                        padding: .7rem 0;
                        border-radius: 50px;
                        color: #ffffff;
                        border: none;
                        text-decoration: none;
                        text-align: center;
                        width: 100%;
                    "
                >
                    Proceed to payment
                </a>
            </div>
        </div>
    ` :

    `
        <div>
            <p class="title">
                Dear Admin, an order with the following details has been created
            </p>
                 
            <div style="margin: 1rem 0 .5rem 0;">
                <table>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Order Code:</th>
                        <td>${ order ? order.orderCode : '--'}</td>
                    </tr>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Amount:</th>
                        <td>${ order ? `$ ${order.amount}` : '--'}</td>
                    </tr>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Date/Time:</th>
                        <td>${ order ? moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss') : '--'}</td>
                    </tr>
                </table>
            </div>
        
            <p style="color: #585858;">Pls proceed to complete the order as soon as possible. Thank you.</p>
        
        </div>
    `
    return populateMail(content);
}


export const paymentInvoiceMailTemplate = (order, recipient, isAdmin) => {
    const content = !isAdmin ? 
    `
        <div>
            <p 
                style="
                    color: #585858;
                    font-family: Raleway;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 150%;
                "
            >
                ${ recipient ? 'Hi '  +  recipient.firstName + ' ' + recipient.lastName : 'Dear Customer' }
            </p>
            
            <p 
                style="
                    color: #585858;
                    font-family: Raleway;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 150%;
                "
            >you have successfully created an order with the following details</p>
            
            <div style="margin: 1rem 0 .5rem 0; font-size: 12px;">
            
                <table>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left; font-size: 12px;">Order Code:</th>
                        <td style="font-size: 12px;">${ order ? order.orderCode : '--'}</td>
                    </tr>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    style="font-size: 12px;">
                        <th style="text-align: left; font-size: 12px;">Amount:</th>
                        <td style="font-size: 12px;">${ order ? `$ ${order.amount}` : '--'}</td>
                    </tr>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    style="font-size: 12px;">
                        <th style="text-align: left; font-size: 12px;">Payment Status:</th>
                        <td style="font-size: 12px;">${ order ? `${order.status.toLowerCase()}` : '--'}</td>
                    </tr>
                    <tr 
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left; font-size: 12px;">Date/Time:</th>
                        <td style="font-size: 12px;">${ order ? moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss') : '--'}</td>
                    </tr>
                </table>
            </div>
            
            <p style="color: #585858;">You can proceed to invoice page to make payment for your service</p>
            
            <p style="color: #585858;">
                contact us via our email <span 
                style="
                    color: #55A9F8;
                    font-family: Raleway;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    margin: .5rem 0;
                "
            >support@aosl-online.com </span> if you have any issues with this transaction.
            </p>
            
            <br/>
            
            <div style="display: flex; justify-content: center; width: 100%; margin: .85rem 0;">
                <a href="${`https://aosl-online.com/invoice/${order.orderCode}?gw=ps`}" target="_blank" class="btn" 
                    style="
                        background-color: #134FE7;
                        padding: .7rem 0;
                        border-radius: 50px;
                        color: #ffffff;
                        border: none;
                        text-decoration: none;
                        text-align: center;
                        width: 100%;
                    "
                >
                    Proceed to payment
                </a>
            </div>
        </div>
    ` :

    `
        <div>
            <p class="title">
                Dear Admin, an order with the following details has been created
            </p>
                 
            <div style="margin: 1rem 0 .5rem 0;">
                <table>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Order Code:</th>
                        <td>${ order ? order.orderCode : '--'}</td>
                    </tr>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Amount:</th>
                        <td>${order.orderType === 'SELL_CRYPTO' ? '$' : 'NGN'} ${ order ? order.amount : '--'}</td>
                    </tr>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Payment Status:</th>
                        <td>${ order ? order.status.toLowerCase() : '--'}</td>
                    </tr>
                    <tr
                        style="
                            color: #585858;
                            font-family: Raleway;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 150%;
                        "
                    >
                        <th style="text-align: left;">Date/Time:</th>
                        <td>${ order ? moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss') : '--'}</td>
                    </tr>
                </table>
            </div>
        
            <p style="color: #585858;">Pls proceed to complete the order as soon as possible. Thank you.</p>
        
        </div>
    `
    return populateMail(content);
}


export const verificationEmail = (userData) => {
    const content = `
        <p>
            Dear esteemed customer your account has been created successfully. Your verification code is <b> ${ userData.code }</b>
        
            We are happy to have you onboard, kindly use link below to begin enjoying our services <br>
            <a href="${`https://www.aosl-online.com/verify/${userData.code}`}" target="_blank">${`https://www.aosl-online.com/verify/${userData.code}`}</a><br>
            Thank you for trusting us.
        </p>
    `;

    return populateMail(content);
};

export const ApplicationEmailTemplate = (applicationData) => {
    const content = `
        <div>
            <p>Dear ${applicationData ? `${applicationData.firstName} ${ applicationData.lastName}` : 'Esteemed Applicant'},</p>
            <br/>
            <br/>

            <p>Thank you for applying for the 
                ${applicationData.role || ''} 
                position at AOSL. 
                We have received your application and will be reviewing it shortly. If your qualifications match our needs, we will contact you for the next steps.
            </p>

            <br/>
            <br/>
            <p>We appreciate your interest in joining us.</p>

            <br/>
            <br/>

            <p>Best regards,</P>
            <p>Promise Osmond</P>
            <p>CEO</P>
            <p>AOSL</P>
        </div>
    `;

    return populateMail(content);
};

export const AdminApplicationEmailTemplate = (applicationData) => {
    const content = `
        <div>
            <p>Dear Promise Osmond,</p>
            <br/>
            <br/>

            <p>
                A new application with application code
                <b>${applicationData.code}</b> has been created. Needs your review and further steps or communication.
            </p>
            <br/>
            <br/>

            <p>Thank you for your consideration.</p>

            <br/>
            <br/>

            <p>Best regards,</P>
            <p>Promise Osmond</P>
        </div>
    `;

    return populateMail(content);
};

export const UserInvoiceEmailTemplate = (InvoiceData, userType = 'user') => {
    const content = `
        <div>
            ${
                userType === 'user' ?
                `
                <p>Dear ${InvoiceData.clientName ? InvoiceData.clientName : 'Valued customer'}, </p>
                ` :
                `
                <p>Dear Admin, </p>
                `
            }
            ${
                userType === 'user' ?
                `
                <p>Thanks for using AOSL, this is an invoice for your recent request</p>
                ` :
                `
                <p>An Invoice has been created for ${InvoiceData.clientName} with the invoice code <b>${InvoiceData.invoiceCode}</b>. </p>
                `
            }

            <br/>
            <div class="box-container">
                <p>
                    <b>Amount Due:</b>
                    <span>${InvoiceData.totalAmount}</span>
                </p>
                <p>
                    <b>Due by:</b>
                    <span>${formatDate(InvoiceData.dueDate)}</span>
                </p>
            </div>

            <br/>
            <div class="flex-center">
                <a 
                    href="https://aosl-online.com/invoice/${InvoiceData.invoiceCode}"
                    target="_blank"
                    class="linkButton"
                >
                    Pay now
                </a>
            </div>

            <br/>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: black;">
                        <b>${InvoiceData.invoiceCode}</b>
                    </td>
                    <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: black; text-align: right;">
                        <b>${formatDate(InvoiceData.issueDate)}</b>
                    </td>
                </tr>
            </table>

            <br/>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr style="border-bottom: 1px solid #9f9c9c;">
                    <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: #9f9c9c;">
                        Description
                    </td>
                    <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: #9f9c9c; text-align: right">
                        Amount (${InvoiceData ? InvoiceData.currency : 'GBP' })
                    </td>
                </tr>
                ${
                    InvoiceData.services.map((service) => (
                    `   
                        <tr style="border-bottom: 1px solid #9f9c9c;">
                            <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: #9f9c9c;">
                                ${service.name}
                            </td>
                            <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: #9f9c9c; text-align: right;">
                                ${service.totalAmount}
                            </td>
                        </tr>
                    `
                    ))
                }
            
                <tr>
                    <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: black;">
                        Total
                    </td>
                    <td style="padding: 10px 0 10px 0; margin: 0; width: 50%; color: black; text-align: right;">
                        ${InvoiceData.totalAmount || 0} (${InvoiceData ? InvoiceData.currency : 'GBP' })
                    </td>
                </tr>
            </table>


            <br/>
            <p>
                If you have any question or concern about this invoice, simply send a mail to this email or reach out to our support team through our support channesl.
                Visit <a href="https://aosl-online.com/contact-us" target="_blank">www.aosl-online.com</a>
            </p>

            <br/>
            <p>Cheers,</p>
            <p>From us @ AOSL Team.</p>
            <hr/>
            <br/>

            <p>
                If you are having an issue with the button above, 
                click <a href="https://aosl-online.com/invoice/${InvoiceData.invoiceCode}" target="_blank">here</a> to proceed to payment.
            </p>

        </div>
    `;
    return populateMail(content);
}

export const resetPasswordEmail = (user, resetCode) => {
    const content = `
        <p>
            Dear customer ${user.firstName || ""} ${ user.lastName || "" }, your password reset code is <strong>${resetCode}</strong>
        </p>
        <br>
        <p>
            If you did not initiate this action pls ensure to secure your account and possibly contact support for further assistance.
        </p>
    `;

    return populateMail(content);
}