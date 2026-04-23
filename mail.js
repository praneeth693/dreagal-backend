const {Resend}=require("resend");
import jsPDF from "jspdf";

const sendBillmail=async (order)=>{
    try{
 const doc = new jsPDF();

  
  doc.text("DREAGAL STORE", 20, 20);
doc.text("GST Invoice",20,30)
  
  

  doc.text(`Name: ${order.customer.name}`, 20, 40);
  doc.text(`Email: ${order.customer.email}`, 20, 50);
  

  let y = 70;
let subtotal=0;
  

  order.items.forEach((item) => {
    const total=item.price*item.quantity;
    subtotal+=total;
    doc.text(
        `${item.title}-${item.quantity}*${item.price}`,20,y
    );
    y+=10;
  });

  const gst=subtotal*0.18;
  const finalTotal=subtotal+gst;

  doc.text(`subtotal:${subtotal}`,20,y+10);
  doc.text(`GST(18%):${gst}`,20,y+20);
  doc.text(`Total:${finalTotal}`,20,y+30);

  const pdfBase64=doc.output("datauristring");
await Resend.emails.send({
    from: "onboarding@resend.dev",
      to: order.customer.email,
      subject: "Order Confirmation",
      html:`
      <h2>order confirmed</h2>
      <p>Your order has been placed successfully.</p>
      <p>GST invoice is attachedwith this email.</p>

      `,
      attachments:[
        {
            filename:"GST_invoice.pdf",
            content:pdfBase64.split(" ,")[1],
        },
      ],
});
console.log("Email Sent Successfully")

    }
    catch(error){
        console.log("Email Error:",error);
        

    }
};
module.exports=sendBillmail;