import React from "react"
import { Card, Form, Input, Button, Typography, Row } from "antd"
import { MailOutlined } from "@ant-design/icons"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { openNotification } from "src/utils"
const { Text } = Typography

const ForgotPasswordPage: React.FC = () => {
  const auth = getAuth()

  const onFinish = async (values: { email: string }) => {
    try {
      await sendPasswordResetEmail(auth, values.email)
      openNotification("success", "Success", "Password reset email sent.")
    } catch (error: any) {
      openNotification("error", "Error", error.message)
    }
  }

  return (
    <>
      <Card
        title="Forgot Password"
        style={{ margin: "auto", maxWidth: "400px" }}
      >
        <Form name="forgot-password-form" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "80%",
                display: "block",
                margin: "auto",
                marginBottom: "20px",
              }}
            >
              Send Reset Email
            </Button>
            <Row align="middle" justify="center">
              <Text type="secondary">
                Remember your password? <a href="/login">Sign In</a>
              </Text>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default ForgotPasswordPage
