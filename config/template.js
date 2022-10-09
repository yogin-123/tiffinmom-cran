const GLOBALS = require('./constants');
var exports = module.exports = {}; // Define Module

exports.send_otp = (otp, callback) => {
  const template = `<!DOCTYPE html>
    <html>
    <body>
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <img src="https://tiffinmom-s3.s3.us-east-1.amazonaws.com/website/logo.png" style="width: 80px;">
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing <b>${GLOBALS.APP_NAME}</b>. Use the following OTP to complete your Sign Up procedures. OTP is valid for <b>5 minutes</b>.</p>
          <h2 style="background: #292929;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br /><b>${GLOBALS.APP_NAME}</b></p>
          <hr style="border:none;border-top:1px solid #eee" />
        </div>
      </div>
    </body>
    </html>`;
  callback(template);
}

exports.place_order = (params, callback) => {
  const template = `<!DOCTYPE html>
  <html>
    <body>
      <section style="margin: 50px;">
        <img src="https://tiffinmom-s3.s3.us-east-1.amazonaws.com/website/logo.png" style="width: 80px;">
        <hr />
        <div>
          <div style="float: left;width: 50%;padding: 10px;">
            <h2>Order ID #${params.order_id}</h2>
            <p>Transaction ID : ${params.transaction_id}</p>
          </div>
          <div style="float: left;width: 50%;padding: 10px;">
            <p>Name : ${params.name}</p>
            <p>Mobile No : ${params.mobile_number}</p>
            <p>Email : ${params.email}</p>
          </div>
          <div style="float: left;width: 50%;padding: 10px;">
            <h1>Billing Details</h1>
            <p>Address : ${params.billing_details}</p>
          </div>
          <div style="float: left;width: 50%;padding: 10px;">
            <h1>Shipping Details</h1>
            <p>Address: ${params.shipping_details}</p>
          </div>
          <div style="float: left;width: 50%;padding: 10px;">
            <h1>Customer Order Note</h1>
            <p>${params.notes}</p>
          </div>
        </div>
        <div>
          <h2>Order</h2>
          <table style="width: 100%;border-collapse: collapse;border: 1px solid #ddd;text-align: left;">
            <tr>
              <th style="padding: 15px;border: 1px solid #ddd;text-align: left;">Item</th>
              <th style="padding: 15px;border: 1px solid #ddd;text-align: left;">Qty</th>
              <th style="padding: 15px;border: 1px solid #ddd;text-align: left;">Price</th>
              <th style="padding: 15px;border: 1px solid #ddd;text-align: left;">Total Price</th>
            </tr>
            ${params.orders}
            <tr>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;"></td>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;"></td>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">Sub Total</td>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${params.sub_total}</td>
            </tr>
            <tr>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;"></td>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;"></td>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">Total</td>
              <td style="padding: 15px;border: 1px solid #ddd;text-align: left;">$${params.final_total}</td>
            </tr>
          </table>
        </div>
      </section>
    </body>
  </html>
  `;
  callback(template);
}