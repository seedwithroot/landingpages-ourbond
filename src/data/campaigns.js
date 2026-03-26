export default {
  "families-peace": [
    {
      uuid: "a7f3d9e2",
      name: "Facebook Parents - Child Safety Focus",
      status: "active",
      createdDate: "2026-03-15",
      brief: {
        goal: "Drive 10K app downloads from concerned parents seeking proactive child safety solutions",
        totalBudget: "$5,000",
        duration: "30 days",
        kpis: [
          { metric: "CPA (Cost Per Acquisition)", target: "< $3.00" },
          { metric: "CTR (Click-Through Rate)", target: "> 2.5%" },
          { metric: "Conversion Rate", target: "> 8%" },
          { metric: "Total Downloads", target: "10,000" }
        ],
        audience: "Parents with children ages 8-18, suburban and urban areas, household income $75K+",
        messaging: "Peace of mind, proactive protection, family connection"
      },
      platforms: {
        "meta": {
          budget: "$2,000",
          targeting: "Parents 35-50, interest in child safety, family apps",
          ads: [
            {
              type: "single-image",
              headline: "Know Your Kids Are Safe",
              primaryText: "Track their location, get alerts when they arrive home. Peace of mind for every parent.",
              description: "Real-time location tracking and instant alerts when your kids arrive safely.",
              cta: "Download Free",
              imageUrl: "https://via.placeholder.com/1200x628/2563eb/ffffff?text=Family+Safety"
            },
            {
              type: "carousel",
              headline: "Family Safety Made Simple",
              primaryText: "Real-time location tracking. Instant alerts. 24/7 security agents. Protect your whole family.",
              cta: "Start Free Trial",
              cards: [
                { imageUrl: "https://via.placeholder.com/1200x628/2563eb/ffffff?text=Track+Location", headline: "Track Location" },
                { imageUrl: "https://via.placeholder.com/1200x628/2563eb/ffffff?text=Get+Alerts", headline: "Get Alerts" },
                { imageUrl: "https://via.placeholder.com/1200x628/2563eb/ffffff?text=24/7+Agents", headline: "24/7 Security Agents" }
              ]
            },
            {
              type: "video",
              headline: "Never Worry About Your Teen Again",
              primaryText: "Monitor location without invading privacy. Get notified when they're safe. Trusted by 50K+ families.",
              cta: "Get Started Free",
              videoUrl: "https://example.com/family-safety-video.mp4",
              thumbnailUrl: "https://via.placeholder.com/1200x628/2563eb/ffffff?text=Video+Thumbnail"
            }
          ]
        },
        "google-search": {
          budget: "$1,500",
          targeting: "Keywords: family safety app, child location tracker, teen safety monitor, family gps tracking",
          headlines: [
            "Child Location Tracker App",
            "Family Safety App - Free Trial",
            "Teen Safety Monitor & Alerts",
            "GPS Tracking for Families",
            "Get Alerts When Kids Arrive",
            "Track Your Children Safely",
            "Family GPS Tracker - Real-Time",
            "Monitor Teen Location 24/7",
            "Child Safety App - 50K+ Parents",
            "Safe Arrival Notifications",
            "Location Sharing for Families",
            "Track Kids Without Invading Privacy",
            "Family Locator & Safety App",
            "Teen Monitoring Made Easy",
            "Know Your Kids Are Safe - Always"
          ],
          descriptions: [
            "Real-time GPS tracking & instant alerts when they arrive safely. Trusted by 50K+ parents.",
            "Know where your kids are at all times. Get alerts, monitor routes, connect with agents 24/7.",
            "Monitor your family's location. Emergency SOS button. 24/7 security agent access.",
            "Keep tabs on your children without invading privacy. Safe arrival alerts. Free download."
          ],
          path1: "family-safety",
          path2: "tracking"
        },
        "google-display": {
          budget: "$1,000",
          targeting: "Parenting websites, family blogs, child safety content",
          ads: [
            {
              size: "300x250",
              headline: "Know Your Kids Are Safe",
              description: "24/7 location tracking & alerts",
              imageUrl: "https://via.placeholder.com/300x250/2563eb/ffffff?text=Family+Safety",
              cta: "Download App"
            },
            {
              size: "728x90",
              headline: "Family Safety Made Simple",
              description: "Track location • Get alerts • 24/7 security agents",
              imageUrl: "https://via.placeholder.com/728x90/2563eb/ffffff?text=Family+Tracking",
              cta: "Try Free"
            },
            {
              size: "160x600",
              headline: "Protect Your Family",
              description: "Real-time GPS tracking",
              imageUrl: "https://via.placeholder.com/160x600/2563eb/ffffff?text=Safety",
              cta: "Download"
            }
          ]
        },
        "instagram": {
          budget: "$500",
          targeting: "Moms 30-45, parenting communities",
          ads: [
            {
              type: "stories",
              headline: "Peace of Mind for Parents",
              description: "Track location • Get alerts • Connect with security agents",
              cta: "Learn More",
              imageUrl: "https://via.placeholder.com/1080x1920/2563eb/ffffff?text=Story+1"
            },
            {
              type: "stories",
              headline: "Protect Your Family",
              description: "Real-time safety monitoring for your whole family",
              cta: "Download Now",
              imageUrl: "https://via.placeholder.com/1080x1920/2563eb/ffffff?text=Story+2"
            }
          ]
        }
      },
      landingPage: {
        template: "families-peace",
        headline: "Keep Your Family Safe & Connected",
        subheadline: "Real-time location tracking, instant alerts, and 24/7 security agents give you the peace of mind you deserve.",
        hero_layout: "image-right",
        hero_image: "https://www.ourbond.com/wp-content/uploads/slider118/psc_content_image.png",
        services_featured: ["Family Location Services", "24/7 Security Agents", "Teen Safety Monitoring"],
        reviews_count: 3
      }
    }
  ],
  
  "families-fear": [
    {
      uuid: "b4e8c1f6",
      name: "Google Search - Emergency Family Safety",
      status: "active",
      createdDate: "2026-03-15",
      brief: {
        goal: "Capture high-intent searches from parents concerned about immediate family safety threats",
        totalBudget: "$5,500",
        duration: "30 days",
        kpis: [
          { metric: "CPA", target: "< $4.00" },
          { metric: "CTR", target: "> 3.0%" },
          { metric: "Conversion Rate", target: "> 10%" },
          { metric: "Total Downloads", target: "8,000" }
        ],
        audience: "Parents actively searching for family safety solutions, high urgency",
        messaging: "Immediate protection, emergency response, never be caught off guard"
      },
      platforms: {
        "google-search": {
          budget: "$4,000",
          targeting: "Keywords: family safety app, child tracking emergency, teen safety monitor, family emergency alert",
          headlines: [
            "Child Tracking Emergency App",
            "Family Emergency Alert System",
            "Teen Safety Monitor - Live GPS",
            "Emergency SOS for Families",
            "Lost Child? Track Immediately",
            "Family Safety App - 24/7 Agents",
            "Emergency Child Location Finder",
            "Instant Emergency Family Alerts",
            "Teen Emergency Response App",
            "Track Kids in Real-Time - Now",
            "Missing Child Alert System",
            "Family Crisis Tracking App",
            "Emergency Child Safety Feature",
            "911-Compatible Family Tracker",
            "Urgent? Track Family Now"
          ],
          descriptions: [
            "Instant alerts. Real-time tracking. 24/7 emergency response. Protect your family now.",
            "Know where your family is at all times. Instant notifications if something's wrong.",
            "Real-time GPS tracking. Emergency SOS button. Professional security agents on standby.",
            "Get emergency alerts instantly. Track family members live. Connect with agents in seconds."
          ],
          path1: "emergency",
          path2: "family-safety"
        },
        "google-display": {
          budget: "$1,500",
          targeting: "Parents researching child safety after local incidents",
          ads: [
            {
              size: "300x250",
              headline: "Don't Wait Until It's Too Late",
              description: "Protect your family now",
              imageUrl: "https://via.placeholder.com/300x250/dc3545/ffffff?text=Emergency+Alert",
              cta: "Act Now"
            },
            {
              size: "728x90",
              headline: "Your Family's Safety Can't Wait",
              description: "Instant alerts • Emergency response • 24/7 monitoring",
              imageUrl: "https://via.placeholder.com/728x90/dc3545/ffffff?text=Family+Emergency",
              cta: "Download Free"
            },
            {
              size: "160x600",
              headline: "Protect Your Family Today",
              description: "Emergency response in seconds",
              imageUrl: "https://via.placeholder.com/160x600/dc3545/ffffff?text=Act+Now",
              cta: "Get Protected"
            }
          ]
        }
      },
      landingPage: {
        template: "families-fear",
        headline: "Don't Wait Until It's Too Late",
        subheadline: "Protect your family with instant alerts, emergency response, and real-time tracking. Download now and never worry again.",
        hero_layout: "centered",
        hero_image: "https://www.ourbond.com/wp-content/uploads/slider118/psc_content_image.png",
        services_featured: ["Emergency Response for All", "Family Check-Ins", "Body Guard Services"],
        reviews_count: 3
      }
    }
  ],
  
  "individuals-peace": [
    {
      uuid: "c9d2a5b8",
      name: "LinkedIn - Young Professionals",
      status: "active",
      createdDate: "2026-03-15",
      brief: {
        goal: "Reach young professionals who commute late or travel frequently for work",
        totalBudget: "$5,000",
        duration: "30 days",
        kpis: [
          { metric: "CPA", target: "< $3.50" },
          { metric: "CTR", target: "> 2.0%" },
          { metric: "Conversion Rate", target: "> 7%" },
          { metric: "Total Downloads", target: "7,500" }
        ],
        audience: "Young professionals (25-40), business travelers, late-night commuters, urban areas",
        messaging: "Confidence, independence, smart protection for your lifestyle"
      },
      platforms: {
        "google-search": {
          budget: "$1,000",
          targeting: "Keywords: personal security app, walk home safe, commute safety, business travel security",
          headlines: [
            "Personal Security App - 24/7",
            "Walk Home Safe - Live Monitoring",
            "Commute Safety for Professionals",
            "Business Travel Security App",
            "Safe Walk Home - Video Agents",
            "Personal Safety While Commuting",
            "Monitored Walk Home Service",
            "Travel Security for Business",
            "Late Night Commute Safety",
            "Virtual Security Agent Escort",
            "Walk Alone? Stay Protected",
            "Safe Arrival for Commuters",
            "Business Traveler Protection",
            "Personal Security - Live Agents",
            "Commuter Safety App - Free Try"
          ],
          descriptions: [
            "Personal security agents monitor your journey. Safe arrival guaranteed. Used by 50K+ professionals.",
            "Virtual security agent accompanies you via video. Real-time monitoring. Instant help if needed.",
            "Business travel protection. Track your route. Connect with agents instantly. Peace of mind.",
            "Walk home with confidence. Video monitoring available. 24/7 security agents ready to help."
          ],
          path1: "personal-safety",
          path2: "professionals"
        },
        "linkedin": {
          budget: "$3,500",
          targeting: "Professionals 25-40, business travelers, late-shift workers",
          ads: [
            {
              type: "single-image",
              headline: "Walk Home Confidently",
              description: "Personal security agents monitor your journey. Safe arrival guaranteed. Used by 50K+ professionals.",
              imageUrl: "https://via.placeholder.com/1200x627/2563eb/ffffff?text=Professional+Security",
              cta: "Learn More"
            },
            {
              type: "video",
              headline: "Never Walk Alone at Night",
              description: "Virtual security agent accompanies you via video. Real-time monitoring. Instant help if needed.",
              videoUrl: "https://example.com/walk-safe-video.mp4",
              thumbnailUrl: "https://via.placeholder.com/1200x627/2563eb/ffffff?text=Video",
              cta: "Download"
            }
          ]
        },
        "programmatic": {
          budget: "$1,500",
          targeting: "Business travel sites, urban living blogs, professional development platforms",
          ads: [
            {
              size: "300x250",
              headline: "Walk Home with Confidence",
              description: "Personal security in your pocket",
              imageUrl: "https://via.placeholder. com/300x250/2563eb/ffffff?text=Walk+Safe",
              cta: "Download App"
            },
            {
              size: "728x90",
              headline: "Professional Security for Your Life",
              description: "Track your route • Video monitoring • 24/7 agents",
              imageUrl: "https://via.placeholder.com/728x90/2563eb/ffffff?text=Personal+Security",
              cta: "Start Free Trial"
            },
            {
              size: "160x600",
              headline: "Safety for Professionals",
              description: "Monitor your commute",
              imageUrl: "https://via.placeholder.com/160x600/2563eb/ffffff?text=Commute+Safe",
              cta: "Try Free"
            }
          ]
        }
      },
      landingPage: {
        template: "individuals-peace",
        headline: "Walk Home with Confidence Every Night",
        subheadline: "Personal security agents monitor your journey, ensuring you arrive safely. Never walk alone again.",
        hero_layout: "split",
        hero_image: "https://www.ourbond.com/wp-content/uploads/slider118/psc_content_image.png",
        services_featured: ["Track Me On The Go", "Video Monitor Me", "24/7 Security Agents"],
        reviews_count: 3
      }
    }
  ],
  
  "individuals-fear": [
    {
      uuid: "d1f7b3c4",
      name: "Reddit - Urban Safety Communities",
      status: "active",
      createdDate: "2026-03-15",
      brief: {
        goal: "Target individuals in urban areas actively discussing safety concerns and recent incidents",
        totalBudget: "$5,000",
        duration: "30 days",
        kpis: [
          { metric: "CPA", target: "< $2.50" },
          { metric: "CTR", target: "> 3.5%" },
          { metric: "Conversion Rate", target: "> 12%" },
          { metric: "Total Downloads", target: "12,000" }
        ],
        audience: "Urban dwellers 22-35, high safety awareness, active on social platforms discussing personal safety",
        messaging: "Immediate protection, emergency response, real danger requires real solutions"
      },
      platforms: {
        "google-search": {
          budget: "$1,500",
          targeting: "Keywords: emergency safety app, walk alone protection, personal security alert, urban safety app",
          headlines: [
            "Emergency Safety App - SOS",
            "Walk Alone Protection - Agents",
            "Personal Security Alert System",
            "Urban Safety App - Free Trial",
            "Walking Alone? Instant Help",
            "Emergency Response in Seconds",
            "Personal Safety Alert - Live",
            "Urban Night Safety with Agents",
            "Walk Alone Safely - Monitored",
            "Emergency App - Siren & 911",
            "Afraid Walking Alone? We Help",
            "Instant Security Alert System",
            "Urban Safety - 24/7 Response",
            "Personal Emergency Protection",
            "Safety App - Connect to Agents"
          ],
          descriptions: [
            "Instant siren. Emergency 911 dial. Security agents on standby. Get help in seconds.",
            "One tap connects you to trained security agents. Video monitoring. Instant emergency response.",
            "Siren to scare off threats. Agent ready to help. Coordinate with 911 if needed. Be prepared.",
            "Emergency protection when walking alone. Instant alerts. Connect with agents immediately."
          ],
          path1: "emergency",
          path2: "personal-safety"
        },
        "reddit": {
          budget: "$2,500",
          targeting: "r/AskWomen, r/TwoXChromosomes, r/PersonalSafety, r/urbanplanning",
          ads: [
            {
              headline: "Feel Unsafe Walking Alone?",
              description: "Instant siren. Emergency 911 dial. Security agents on standby. Get help in seconds.",
              cta: "Protect Yourself Now"
            },
            {
              headline: "Emergency Protection in Your Pocket",
              description: "One tap connects you to trained security agents. Video monitoring. Instant emergency response.",
              cta: "Download Free"
            },
            {
              headline: "Don't Walk Home Scared",
              description: "Siren to scare off threats. Agent ready to help. Coordinate with 911 if needed. Be prepared.",
              cta: "Get Protected"
            }
          ]
        },
        "programmatic": {
          budget: "$2,500",
          targeting: "Urban safety blogs, late night content sites, safety tip platforms",
          ads: [
            {
              size: "300x250",
              headline: "Don't Be a Target",
              description: "Emergency protection in your pocket",
              imageUrl: "https://via.placeholder.com/300x250/dc3545/ffffff?text=Emergency+Alert",
              cta: "Get Protected"
            },
            {
              size: "728x90",
              headline: "Walking Alone? Stay Safe.",
              description: "Instant siren • Emergency 911 • Security agents",
              imageUrl: "https://via.placeholder.com/728x90/dc3545/ffffff?text=Stay+Safe",
              cta: "Download Now"
            },
            {
              size: "160x600",
              headline: "Emergency Protection",
              description: "Get help in seconds",
              imageUrl: "https://via.placeholder.com/160x600/dc3545/ffffff?text=Emergency",
              cta: "Act Now"
            }
          ]
        }
      },
      landingPage: {
        template: "individuals-fear",
        headline: "Stop Feeling Unsafe When You Walk Alone",
        subheadline: "One tap connects you to emergency security agents. Siren to scare threats. Instant 911 coordination. Real protection when you need it most.",
        hero_layout: "centered-urgent",
        hero_image: "https://www.ourbond.com/wp-content/uploads/slider118/psc_content_image.png",
        services_featured: ["Siren", "Ready An Agent", "Dial 911"],
        reviews_count: 3
      }
    }
  ]
};
