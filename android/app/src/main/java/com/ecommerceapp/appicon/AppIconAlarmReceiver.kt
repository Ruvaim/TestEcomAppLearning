package com.ecommerceapp.appicon

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class AppIconAlarmReceiver : BroadcastReceiver() {

    companion object {

        const val ACTION_PROMOTIONAL =
            "com.ecommerceapp.appicon.ACTION_PROMOTIONAL"

        const val ACTION_DEFAULT =
            "com.ecommerceapp.appicon.ACTION_DEFAULT"

        private const val RETRY_REQUEST_CODE = 9001
    }

    override fun onReceive(
        context: Context,
        intent: Intent
    ) {

        when (intent.action) {

            ACTION_PROMOTIONAL -> {
                handleIconChange(
                    context,
                    "PromotionalIcon"
                )
            }

            ACTION_DEFAULT -> {
                handleIconChange(
                    context,
                    null
                )
            }
        }
    }

    private fun handleIconChange(
        context: Context,
        iconName: String?
    ) {

        /*
         * IMPORTANT:
         *
         * Changing launcher aliases while the app's task
         * is currently active can cause Android to close
         * the task.
         */
        if (AppVisibilityTracker.isAppInForeground) {

            scheduleRetry(
                context,
                iconName
            )

            return
        }

        AppIconSwitcher.setIcon(
            context,
            iconName
        )
    }

    private fun scheduleRetry(
        context: Context,
        iconName: String?
    ) {

        val alarmManager =
            context.getSystemService(
                Context.ALARM_SERVICE
            ) as AlarmManager

        val intent = Intent(
            context,
            AppIconAlarmReceiver::class.java
        ).apply {

            action =
                if (iconName == "PromotionalIcon") {
                    ACTION_PROMOTIONAL
                } else {
                    ACTION_DEFAULT
                }
        }

        val pendingIntent =
            PendingIntent.getBroadcast(
                context,
                RETRY_REQUEST_CODE +
                    if (iconName == "PromotionalIcon") 1 else 2,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or
                    PendingIntent.FLAG_IMMUTABLE
            )

        val retryTime =
            System.currentTimeMillis() + 10_000L

        if (
            Build.VERSION.SDK_INT >=
            Build.VERSION_CODES.M
        ) {

            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                retryTime,
                pendingIntent
            )

        } else {

            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                retryTime,
                pendingIntent
            )
        }
    }
}