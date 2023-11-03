import React, { useState } from "react"
import { useUser } from "src/hooks/user"
import { Button, Card, Form, Input, Row, Typography } from "antd"
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"

const { Text } = Typography

const SignUpPage: React.FC = () => {
  const { signUp, googleSignIn } = useUser()
  const [showPassword] = useState(false)

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await signUp(values.email, values.password)
    } catch (error) {
      //
    }
  }

  return (
    <>
      <Card title="Sign Up" style={{ margin: "auto", maxWidth: "400px" }}>
        <Form
          name="signup-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
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
              Sign Up
            </Button>
            <Button
              onClick={googleSignIn}
              style={{
                backgroundColor: "#4285F4",
                color: "white",
                width: "80%",
                display: "block",
                margin: "10px auto",
              }}
              icon={<GoogleOutlined />}
            >
              Sign up with Google
            </Button>
            <Row align="middle" justify="center">
              <Text type="secondary">
                Already have an account? <Link to="/login">Sign In</Link>
              </Text>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default SignUpPage
