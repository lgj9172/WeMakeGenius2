<%@page import="org.json.JSONArray"%>
<%@ page language="java" contentType="text/plain; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="org.json.simple.JSONObject"%>
<%@page import="java.sql.*"%>
<%@page import="java.io.*"%>
<%
	String id = request.getParameter("id");
	String message = "정상적으로 로그인 되었습니다.";
	String correct_id = "";
	String name = "";
	int result = 0;
	int rowCnt = 0;
	JSONObject jsono = new JSONObject();

	try {

		String driverName = "com.mysql.jdbc.Driver";

		Class.forName(driverName);
		Connection con = DriverManager
				.getConnection(
						"jdbc:mysql://ec2-54-199-180-105.ap-northeast-1.compute.amazonaws.com:3306/wmg_dev",
						"wmg", "wmg");
		PreparedStatement ps;
		Statement stat = con.createStatement();
		ResultSet rs = stat.executeQuery("select ID, NAME from user where ID = '"+ id + "'");

		while (rs.next()) {
			name = rs.getString("NAME");
			correct_id = rs.getString("ID");
		}

		if ( correct_id.equals("")) {
			message = "해당 아이디가 존재하지 않습니다.";
			result = 0;
		} 
		else 
		{
			result = 1;
			correct_id = id;	
			jsono.put("id",correct_id);
			jsono.put("name",name);
		}
		
		rs.close();
		stat.close();
		con.close();
	} catch (ClassNotFoundException e) {
		e.printStackTrace();
		result = 0;
		message = e.getMessage().toString();
	} catch (SQLException e) {
		e.printStackTrace();
		result = 0;
		message = e.getMessage().toString();
	} finally {
		jsono.put("result", result);
		jsono.put("message", message);
		out.println(jsono);
	}
%>