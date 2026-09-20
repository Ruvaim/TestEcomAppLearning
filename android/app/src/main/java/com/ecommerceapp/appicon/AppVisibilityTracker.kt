package com.ecommerceapp.appicon

import android.app.Activity
import android.app.Application
import android.os.Bundle

object AppVisibilityTracker {

    @Volatile
    var isAppInForeground: Boolean = false
        private set

    fun register(application: Application) {

        application.registerActivityLifecycleCallbacks(
            object : Application.ActivityLifecycleCallbacks {

                override fun onActivityResumed(activity: Activity) {
                    isAppInForeground = true
                }

                override fun onActivityPaused(activity: Activity) {
                    isAppInForeground = false
                }

                override fun onActivityCreated(
                    activity: Activity,
                    savedInstanceState: Bundle?
                ) {}

                override fun onActivityStarted(activity: Activity) {}

                override fun onActivityStopped(activity: Activity) {}

                override fun onActivitySaveInstanceState(
                    activity: Activity,
                    outState: Bundle
                ) {}

                override fun onActivityDestroyed(activity: Activity) {}
            }
        )
    }
}