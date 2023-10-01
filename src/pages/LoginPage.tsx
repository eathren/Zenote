import { useUser } from "src/hooks/user"
import { Button, Checkbox, Form, Input } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"

const LoginPage = () => {
  // State variables with explicit types
  const { signIn } = useUser()

  const onFinish = (values: any) => {
    signIn(values.email, values.password)
  }

  return (
    <>
      <h2> Sign In</h2>
      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Username!" }]}
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
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a href="">Forgot password</a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginPage
