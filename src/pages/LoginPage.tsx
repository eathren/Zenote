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

const LoginPage: React.FC = () => {
  const { signIn, googleSignIn } = useUser()
  const [showPassword] = useState(false)

  // Function to handle form submission
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await signIn(values.email.trim(), values.password.trim())
    } catch (error: any) {
      //
    }
  }

  return (
    <>
      <Card title="Sign In" style={{ margin: "auto", maxWidth: "400px" }}>
        <Typography>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
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
              <Link to="/forgot-password" style={{ float: "right" }}>
                <Text type="secondary">Forgot password?</Text>
              </Link>
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
                Log in
              </Button>
              <Button
                onClick={googleSignIn}
                style={{
                  backgroundColor: "#4285F4",
                  color: "white",
                  width: "80%",
                  display: "block",
                  margin: "10px auto 20px",
                }}
                icon={<GoogleOutlined />}
              >
                Sign in with Google
              </Button>
              <Row align="middle" justify="center">
                <Text type="secondary">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </Text>
              </Row>
            </Form.Item>
          </Form>
        </Typography>
      </Card>
    </>
  )
}

export default LoginPage
