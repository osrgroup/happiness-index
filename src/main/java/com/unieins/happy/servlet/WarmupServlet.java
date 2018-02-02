package com.unieins.happy.servlet;


import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.unieins.happy.project.ProjectEndpoint;
import com.unieins.happy.user.UserEndpoint;

public class WarmupServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8409689949482466830L;
	User user;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		if (!req.getRequestURI().startsWith("/_ah/warmup")) {
			resp.sendError(404);
			return;
		}

		java.util.logging.Logger.getLogger("logger").log(Level.INFO, " Warming Up");

		user = new User("kaufmann@group.riehle.org", "", "107009250225703298090");

		try {
			warmupProjectEndpoint(user);
			warmupUserEndpoint();

		} catch (UnauthorizedException e) {
			Logger.getLogger("logger").log(Level.WARNING, "user not authorized ");
			e.printStackTrace();
		}

		resp.setContentType("text/plain");
		resp.getOutputStream().print("warmup finished");

		java.util.logging.Logger.getLogger("logger").log(Level.INFO, " Warmup finished");
	}

	private void warmupUserEndpoint() {
		UserEndpoint ue = new UserEndpoint();
		ue.getCurrentUser(user);
	}

	private void warmupProjectEndpoint(User user) throws UnauthorizedException {
		ProjectEndpoint pe = new ProjectEndpoint();

		pe.listProject(null, null, 6253522915950592L, user);

	}


}
