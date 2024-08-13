export const success = (res, status, entity, msg) => res
    .status(status || 200)
    .json({
        success: true,
        message: msg || "Successful",
        count: entity ? entity.length : 0,
        payload: entity || [],
    });

export const fail = (res, status, msg) => res
    .status(status || 500)
    .json({
        success: false,
        message: msg || "Failed",
        payload: [],
    });

export const response = (res, status, entity, msg) => res
.status(status || 200)
.json({
    success: true,
    message: entity.msg || msg || "Successful",
    metadata: { 
        total: entity.total || 0,
        limit: entity.limit || 0,
        count: entity.count || 0,
        skip: entity.skip || 0,
        page: (Math.floor((entity.skip + entity.limit) / entity.limit)) || 1,
        sort: entity.sort || "createdAt",
    },
    payload: entity.payload || [],
});

export const configurePaypalResponseMessage = (status, payer) => {
    let message = '';
    if(status === 'COMPLETED'){
        message = `
            <h1 style="font-size: 1rem; font-weight: bold; text-align: center;">Your Invoice Order checkout was Completed</h1>
            <p style="text-align: center; margin-bottom: 10px;">Thank you for trust us</p>
        `
    }
    if(status === 'APPROVED'){
        message = `
            <h1 className="text-xl md:text-2xl lg:text-2xl font-semibold text-center">Your Invoice Order checkout was successful.</h1>
            <p style="text-align: center; margin-bottom: 10px;">A confirmation Email has been sent to ${payer.email_address}</p>
            <p style="text-align: center; margin-bottom: 10px;">Be rest assured that we will fulfill your order as soon as possible</p>
            <p style="text-align: center; margin-bottom: 10px;">Thank you for trust us</p>
        `
    }
    return message;
}