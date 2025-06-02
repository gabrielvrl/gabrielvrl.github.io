---
title: "Mobile development – Rethinking the approach around UI delivery"
description: "Server-driven UI on mobile development"
pubDate: "Jun 02 2025"
heroImage: "/server-driven-ui.png"
---

I began my career in web development, where I worked for about a year and a half to two years before transitioning to mobile development, carrying over many practices I had learned on the web. However, over time I noticed that some traditional web development approaches don’t always translate well to the mobile context. Even with a few years of experience, this led me to reflect: **what’s the best way to build and maintain mobile apps?**

In my experience, mobile apps are traditionally built following a similar pattern to web apps: the backend provides the data, and the frontend, whether web or mobile, builds the UI, defines the copy, organizes the components, and implements behavior.

But there's a key difference in mobile development: **apps must go through app stores**, mainly the Google Play Store (Android) and Apple App Store (iOS), something that's not required for web. This makes the deployment of new versions more costly and slower. In addition to waiting for store approval (which can take days), teams must gradually roll out new versions to users, monitor errors and crashes, and only then expand the release. Furthermore, users must manually update the app via the store to access changes, which can further delay adoption. So even a simple update can take days or even weeks to reach the end user. While it’s possible to force users to update, that often worsens the overall user experience.

So, when faced with certain challenges throughout my career, I found myself thinking about how I could make things easier, for myself, for my team, and for our users, by delivering the best possible experience as quickly as possible.

## The Problem and Firebase

I wanted a solution that could bypass the long deployment cycle required to push new versions of a mobile app, especially for **simple changes**, like tweaking copy, turning features on or off, or adjusting flow logic.

One of the most well-known tools to help mitigate the slow mobile deployment process is **Firebase** (and its competitors, like _Supabase_). These backend-as-a-service platforms offer robust features, including **Remote Configs**, which allow you to update text, enable or disable features, change flows, and even send complex objects to the app, all **without** needing to publish a new version to the store. These platforms also support A/B testing, user behavior monitoring, authentication, and much more.

In this article, I'll focus specifically on **UI construction**, so we’ll leave those other features aside for now.

But let’s say, for example, you want to **block a specific feature for certain users**. I'm not a Firebase expert, but from what I've studied, it is indeed possible to do this, for instance, by maintaining a list of user `ids` that should be blocked or allowed, and checking this list at the time of rendering a component. That works, sure.

But notice we’re **introducing complexity**, even if it seems small, at **runtime** (when the app is already running on the user's device), which may not always be modern or powerful.

Now imagine if that display logic were applied to multiple features throughout the app. That can start to take a toll. And worse: imagine that deciding whether to show or hide a given feature depends on **multiple backend data points,** like how many strikes a user has, available credits, usage profile, and so on. Yes, you can solve this with backend queries and dynamic lists. But maybe a **better alternative** would be to process this logic **on the backend** and only send the app what it needs to render.

And that's exactly where the concept I’ve been studying and applying comes in: **Server-Driven UI**.

## Server-Driven UI

Unlike the traditional structure, where the server simply supplies data for the UI and the frontend handles how it looks, **Server-Driven UI (SDUI)** is an architectural pattern where the **server defines part (or all) of the app's UI structure**, and the client (mobile or even web) simply **interprets and renders that UI** based on the data received, usually in JSON format.

In other words, instead of building 100% of the UI in the app, we delegate to the server the control over **what to show, how to show it, and even when to show it**. The app acts as a kind of “UI renderer”.

Example payload:

```json
{
  "type": "screen",
  "title": "Promotions",
  "components": [
    {
      "type": "text",
      "value": "Welcome, John!"
    },
    {
      "type": "button",
      "label": "See offers",
      "action": {
        "type": "navigate",
        "to": "/promotions"
      }
    }
  ]
}
```

The app then interprets this JSON and **renders the corresponding components**, acting like a mini internal layout engine.

✅ This model brings several clear advantages:

- **Faster, real-time deployments:** update the UI without releasing a new app version.
- **Stronger feature flags and A/B testing capabilities.**
- **Rapid UI experiments.**
- Allows **interface customization by user or group**.
- Useful for companies with **multiple apps/versions**, sharing a common core.

❌ But it also comes with trade-offs:

- **Increased complexity on the client:** you’ll need a robust interpreter.
- Less fluid/responsive UI if poorly implemented.
- Debugging becomes harder due to dynamic content.
- Risk of regression if backend JSON has issues.
- Traditional UI testing becomes more complicated.

Server-Driven UI is a technique that makes a lot of sense when your product or app is in a **dynamic phase** and needs flexibility. Scenarios like frequent campaign launches, layout experiments, user segmentation, or fast copy updates can greatly benefit from this model.

But it’s important to be clear: **this isn’t magic,** and it’s **definitely not for everything**.

If most of your app has a stable UI, with little user variation, or if flows are well-defined and rarely change, the cost of adopting SDUI may not be worth it. After all, by implementing this model, you lose some of the **predictability and control** you get when building screens traditionally.

Additionally, building a strong UI interpreter on the client side requires **thoughtful architecture**, payload error handling, component fallbacks, versioning support, incremental loading, performance… You can't just start rendering UI from JSON and expect it to “just work”.

That’s why SDUI is often applied to **more unstable or business-driven areas** of the app, like marketing screens, campaign banners, onboarding, dynamic forms, and so on. For critical flows or those with heavy native interaction, it may be better to stick with the traditional model, or **combine both approaches**.

## Final Thoughts

**Server-Driven UI is not a silver bullet**, but when used intentionally, it can be a powerful tool. If your team needs more agility to test, personalize, or iterate on UI flows frequently — especially without going through the full mobile release cycle — it’s well worth exploring.

In my case, studying and applying this architecture has significantly changed the way I think about mobile app development, especially in fast-paced environments. If you face similar challenges, it might be time to explore SDUI and see how it can transform the way your team builds apps.

Thanks for reading!
