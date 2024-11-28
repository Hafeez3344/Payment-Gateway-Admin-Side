import React from "react";
import { Button, Checkbox, Form, Grid, Input, Typography, notification } from "antd"; 
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { fn_loginAdminApi } from "../../api/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const onFinish = async (values) => {
    try {
      const response = await fn_loginAdminApi(values);
      console.log("response ", response);
      if (response?.status) {
        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in!",
          placement: "topRight",
        });
        Cookies.set("token", response?.token);
        navigate("/"); 
      } else {
        notification.error({
          message: "Login Failed",
          description: response?.message || "Invalid credentials. Please try again.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Login error: ", error);
      notification.error({
        message: "Error",
        description: "An unexpected error occurred. Please try again later.",
        placement: "topRight",
      });
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? "40px" : "30px 15px",
      width: "380px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    footer: {
      marginTop: "20px",
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: "30px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    section: {
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: "40px 0",
    },
    text: {
      color: "#6c757d",
    },
    title: {
      fontSize: screens.md ? "24px" : "20px",
      marginTop: "10px",
    },
    logo: {
      width: "80px",
      height: "auto",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Title style={styles.title}>Admin Login</Title>
          <Text style={styles.text}>
            Welcome back! Please enter your details below to log in as an admin.
          </Text>
        </div>
        <Form
          name="admin_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="#">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="#">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
