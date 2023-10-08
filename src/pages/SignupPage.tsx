import { useUser } from "src/hooks/user"
import { Button, Form, Input } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { Typography } from "antd"
const { Title } = Typography
const SignUpPage = () => {
  // State variables with explicit types
  const { signUp } = useUser()
  const onFinish = (values: any) => {
    signUp(values.email, values.password)
  }

  return (
    <>
      <Typography>
        <Title> Sign Up</Title>
        <Form
          name="normal_login"
          className="login-form"
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
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Sign Up
            </Button>
            Or <a href="">Login</a>
          </Form.Item>
        </Form>
      </Typography>
    </>
  )
}

export default SignUpPage
