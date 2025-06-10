import { domainUrl } from "./baseUrl";

export const linking = {
  prefixes: [domainUrl],
  config: {
    screens: {
      Auth: {
        path: "auth",
        screens: {
          Login: "login",
          Register: "register",
          Onboarding: "onboarding",
        },
      },
      ClientRoot: {
        path: "clientroot",
        screens: {
          ClientTabs: {
            path: "tabs",
            screens: {
              Dashboard: "dashboard",
              Search: "search",
              Projects: "projects",
              Notifications: "notifications",
              Profile: "profile",
            },
          },
          JobDetails: {
            path: "job/:jobId",
            parse: {
              jobId: (jobId: string) => jobId,
            },
          },
          FreelancerProfile: {
            path: "freelancer/:freelancerId",
            parse: {
              freelancerId: (freelancerId: string) => freelancerId,
            },
          },
          ClientSettings: "settings",
        },
      },
      FreelancerRoot: {
        path: "freelancerroot",
        screens: {
          FreelancerTabs: {
            path: "tabs",
            screens: {
              Dashboard: "dashboard",
              Jobs: "jobs",
              Projects: "projects",
              Notifications: "notifications",
              Profile: "profile",
            },
          },
          JobDetails: {
            path: "job/:jobId",
            parse: {
              jobId: (jobId: string) => jobId,
            },
          },
          ClientProfile: {
            path: "client/:clientId",
            parse: {
              clientId: (clientId: string) => clientId,
            },
          },
          FreelancerSettings: "settings",
        },
      },
      CompanyRoot: {
        path: "companyroot",
        screens: {
          CompanyTabs: {
            path: "tabs",
            screens: {
              Dashboard: "dashboard",
              Jobs: "jobs",
              Team: "team",
              Notifications: "notifications",
              Profile: "profile",
            },
          },
          JobDetails: {
            path: "job/:jobId",
            parse: {
              jobId: (jobId: string) => jobId,
            },
          },
          ApplicantProfile: {
            path: "applicant/:applicantId",
            parse: {
              applicantId: (applicantId: string) => applicantId,
            },
          },
          CreateJob: "createjob",
          CompanySettings: "settings",
          CreateTeam: "createteam",
        },
      },
      AdminRoot: {
        path: "adminroot",
        screens: {
          AdminTabs: {
            path: "tabs",
            screens: {
              Dashboard: "dashboard",
              Users: "users",
              Jobs: "jobs",
              Reports: "reports",
              Settings: "settings",
            },
          },
          UserDetails: {
            path: "user/:userId",
            parse: {
              userId: (userId: string) => userId,
            },
          },
          JobDetails: {
            path: "job/:jobId",
            parse: {
              jobId: (jobId: string) => jobId,
            },
          },
          ReportDetails: {
            path: "report/:reportId",
            parse: {
              reportId: (reportId: string) => reportId,
            },
          },
          AdminSettings: "settings",
        },
      },
      Chat: "chat",
      ChatRoom: {
        path: "chatroom/:roomId",
        parse: {
          roomId: (roomId: string) => roomId,
        },
      },
      Call: {
        path: "call/:callId",
        parse: {
          callId: (callId: string) => callId,
        },
      },
    },
  },
};
