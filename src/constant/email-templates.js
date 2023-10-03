export const orderEmailTemplate = (order, recipient) => {
    return `
        <html>
            <head>
                <style>
                    .container {
                        background-color: #8652A44D;
                        width: 100%;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                    }
                    
                    .main-content {
                        background-color: #ffffff;
                        width: 40%;
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
                        background-color: #8652A4;
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
                        justify-content: center;
                        border-bottom: 1px solid #585858;
                        min-height: 50px;
                        padding: 1rem 0;
                    }
                    
                    .title {
                        color: var(--BEDROCK-TEXT-2, #585858);
                        font-family: Raleway;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 600;
                        line-height: 150%; /* 24px */
                    }
                    
                    .emailText {
                        color: var(--BEDROCK-BLUE, #55A9F8);
                        font-family: Raleway;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 150%;
                    }

                    @media screen and (max-width: 480px) {
                        .main-content {
                            width: 80%;
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
                    }
                
                </style>
            </head>

            <body>
                <div class="container">
                    <div class="main-content">
                        <div class="header">
                            <img src="https://www.chinosexchange.com/static/media/logo.7939126ea4aa7c1dc477.png" width="120px" height="60px" alt="logo" />
                        </div>
                    
                        <div class="content">
                            <p class="title">
                                ${ recipient ? 'Hi '  +  recipient.firstName + ' ' + recipient.lastName : 'Dear Customer' }
                            </p>
                            
                            <p>you have successfully created an order with the following details</p>
                            
                            <table style="margin: 1rem 0 .5rem 0;">
                                <tr class="title">
                                    <th style="text-align: left;">Order Code:</th>
                                    <td>${ order ? order.orderCode : '--'}</td>
                                </tr>
                                <tr class="title">
                                    <th style="text-align: left;">Amount:</th>
                                    <td>NGN ${ order ? order.amount : '--'}</td>
                                </tr>
                                <tr class="title">
                                    <th style="text-align: left;">Date/Time:</th>
                                    <td>${ order ? order.createdAt : '--'}</td>
                                </tr>
                            </table>
                            
                            <p>Be aware that your order would be processed as soon as possible</p>
                            
                            <br/>
                            <p>
                                contact us via our email <span class="emailText">admin@chinosexchange.com </span> if you have any issues with this transaction or Click on the link below to chat with our admin
                            </p>
                            
                            <br/>
                            
                            <div style="display: flex; justify-content: center; width: 100%; margin: .85rem 0;">
                                <a href="https://wa.me/2347031625759" target="_blank" class="btn">
                                    Chat via whatsapp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        
    
    `
}