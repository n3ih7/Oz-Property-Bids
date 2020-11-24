import smtplib
import sys
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.header import Header

content = ''
if str(sys.argv[1]) == "successToSeller":
    print("trying successToSeller sending... by 1 to " + str(sys.argv[3]))
    content = "Hi " + str(sys.argv[2]) + ",\n\nWe are thrilled to let you know that your property (" + \
              str(sys.argv[4]) + ") has been sold successfully. The final price is $" + str(sys.argv[5]) + \
              ".\n\nHere are the buyer's details:\n\tName: " + str(sys.argv[6]) + \
              "\n\tPayment Method: " + str(sys.argv[7]) + "\n\tEmail: " + str(sys.argv[8]) + "\n\tMobile: " + \
              str(sys.argv[9]) + "\n\tAddress: " + str(sys.argv[
                                                           10]) + "\n\nWe hope you have a nice day. If you have " \
                                                                  "anything concerned, please don't hesitate to " \
                                                                  "contact us.\n\nSincerely\nOz Property Team"

if str(sys.argv[1]) == "successToBuyer":
    print("trying successToBuyer sending... by 1 to " + str(sys.argv[3]))
    content = "Hi " + str(sys.argv[2]) + ",\n\nWe are thrilled to let you know that your bid on property (" + \
              str(sys.argv[4]) + ") was successful. The final price is $" + str(
        sys.argv[5]) + " and you choose " + str(
        sys.argv[6]) + " as your payment method.\n\nHere are the seller's details:\n\tName: " + str(
        sys.argv[7]) + "\n\tEmail: " + str(sys.argv[8]) + "\n\tMobile: " + str(
        sys.argv[9]) + "\n\nWe hope you have a nice day. If you have anything concerned, " \
                       "please don't hesitate to contact us.\n\nSincerely\nOz Property Team"

if str(sys.argv[1]) == "failToSeller":
    print("trying failToSeller sending... by 1 to " + str(sys.argv[3]))
    content = "Hi, " + str(sys.argv[2]) + "\n\nWe are sorry to let you know that we were unable to find a " \
                                          "buyer for your property (" + str(sys.argv[4]) + \
              ")\n\nWe hope you can give us a secoond chance. If you concern about anything, " \
              "please don't hesitate to contact us" \
              ".\n\nSincerely\nOz Property Team"

if content != '':
    try:
        msg = EmailMessage()
        msg['From'] = "Oz Property Team"
        msg['Subject'] = "Auction result notice"
        msg['To'] = str(sys.argv[3])
        msg.set_content(content)
        gmail_user = 'YOUR_OWN_GMAIL_ACCOUNT'
        gmail_password = 'YOUR_OWN_GMAIL_PASSWORD'
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        print("email sent by 1 " + str(sys.argv[1]) + " to " + str(sys.argv[3]))

    except:
        print("Something went wrong...trying another sending system " + str(sys.argv[1]) + " to " + str(sys.argv[3]))
        msg = MIMEText(content, "plain", 'utf-8')
        msg["Subject"] = Header("Auction result notice", 'utf-8')
        msg["From"] = "Oz Property Team"
        msg["To"] = str(sys.argv[3])
        tencent_user = 'YOUR_OWN_SMTP_ACCOUNT'
        tencent_password = 'YOUR_OWN_SMTP_PASSWORD'
        server = smtplib.SMTP_SSL('smtp.qq.com', 465)
        server.ehlo(server)
        server.login(tencent_user, tencent_password)
        server.sendmail(tencent_user, str(msg["To"]), msg.as_string())
        server.quit()
        print("email sent by 2 " + str(sys.argv[1]) + " to " + str(sys.argv[3]))
