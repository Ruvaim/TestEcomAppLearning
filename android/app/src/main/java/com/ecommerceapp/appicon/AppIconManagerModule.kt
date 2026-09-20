package com.ecommerceapp.appicon

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppIconManagerModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    companion object {

        const val PREFS_NAME =
            "app_icon_scheduler"

        const val START_TIME =
            "start_time"

        const val END_TIME =
            "end_time"
    }

    override fun getName(): String {
        return "AppIconManager"
    }


    @ReactMethod
    fun setIcon(
        iconName: String?,
        promise: Promise
    ) {
        try {

            AppIconSwitcher.setIcon(
                reactApplicationContext,
                iconName
            )

            promise.resolve(true)

        } catch (exception: Exception) {

            promise.reject(
                "ICON_CHANGE_FAILED",
                exception.message,
                exception
            )
        }
    }


    @ReactMethod
    fun canScheduleExactAlarms(
        promise: Promise
    ) {
        try {

            val alarmManager =
                reactApplicationContext.getSystemService(
                    Context.ALARM_SERVICE
                ) as AlarmManager

            val canSchedule =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    alarmManager.canScheduleExactAlarms()
                } else {
                    true
                }

            promise.resolve(canSchedule)

        } catch (exception: Exception) {

            promise.reject(
                "EXACT_ALARM_CHECK_FAILED",
                exception.message,
                exception
            )
        }
    }

    @ReactMethod
    fun openExactAlarmSettings(
        promise: Promise
    ) {
        try {

            val context =
                reactApplicationContext

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {

                val intent = Intent(
                    Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
                    Uri.parse(
                        "package:${context.packageName}"
                    )
                )

                intent.addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK
                )

                context.startActivity(intent)
            }

            promise.resolve(true)

        } catch (exception: Exception) {

            promise.reject(
                "EXACT_ALARM_SETTINGS_FAILED",
                exception.message,
                exception
            )
        }
    }

    @ReactMethod
    fun scheduleIconChange(
        startTimeMillis: Double,
        endTimeMillis: Double,
        promise: Promise
    ) {
        try {

            val context =
                reactApplicationContext

            val startTime =
                startTimeMillis.toLong()

            val endTime =
                endTimeMillis.toLong()

            // Check that start/end times are valid
            if (endTime <= startTime) {

                promise.reject(
                    "INVALID_ICON_SCHEDULE",
                    "End time must be after start time."
                )

                return
            }

            // Check exact alarm permission before scheduling
            val alarmManager =
                context.getSystemService(
                    Context.ALARM_SERVICE
                ) as AlarmManager

            if (
                Build.VERSION.SDK_INT >=
                Build.VERSION_CODES.S &&
                !alarmManager.canScheduleExactAlarms()
            ) {

                promise.reject(
                    "EXACT_ALARM_PERMISSION_REQUIRED",
                    "Exact alarm permission is not granted."
                )

                return
            }

            // Save schedule
            context
                .getSharedPreferences(
                    PREFS_NAME,
                    Context.MODE_PRIVATE
                )
                .edit()
                .putLong(
                    START_TIME,
                    startTime
                )
                .putLong(
                    END_TIME,
                    endTime
                )
                .apply()

            // Schedule promotional icon
            scheduleAlarm(
                context,
                startTime,
                AppIconAlarmReceiver.ACTION_PROMOTIONAL,
                1001
            )

            // Schedule default icon
            scheduleAlarm(
                context,
                endTime,
                AppIconAlarmReceiver.ACTION_DEFAULT,
                1002
            )

            promise.resolve(true)

        } catch (exception: Exception) {

            promise.reject(
                "ICON_SCHEDULE_FAILED",
                exception.message,
                exception
            )
        }
    }


    @ReactMethod
    fun cancelIconSchedule(
        promise: Promise
    ) {
        try {

            val context =
                reactApplicationContext

            val alarmManager =
                context.getSystemService(
                    Context.ALARM_SERVICE
                ) as AlarmManager

            cancelAlarm(
                context,
                alarmManager,
                AppIconAlarmReceiver.ACTION_PROMOTIONAL,
                1001
            )

            cancelAlarm(
                context,
                alarmManager,
                AppIconAlarmReceiver.ACTION_DEFAULT,
                1002
            )

            // Clear saved schedule
            context
                .getSharedPreferences(
                    PREFS_NAME,
                    Context.MODE_PRIVATE
                )
                .edit()
                .clear()
                .apply()

            // Restore default icon
            AppIconSwitcher.setIcon(
                context,
                null
            )

            promise.resolve(true)

        } catch (exception: Exception) {

            promise.reject(
                "ICON_SCHEDULE_CANCEL_FAILED",
                exception.message,
                exception
            )
        }
    }

    private fun scheduleAlarm(
        context: Context,
        triggerAtMillis: Long,
        action: String,
        requestCode: Int
    ) {

        val alarmManager =
            context.getSystemService(
                Context.ALARM_SERVICE
            ) as AlarmManager

        val intent =
            Intent(
                context,
                AppIconAlarmReceiver::class.java
            ).apply {

                this.action = action
            }

        val pendingIntent =
            PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or
                    PendingIntent.FLAG_IMMUTABLE
            )

        if (
            Build.VERSION.SDK_INT >=
            Build.VERSION_CODES.S &&
            !alarmManager.canScheduleExactAlarms()
        ) {

            throw IllegalStateException(
                "Exact alarm permission is not granted."
            )
        }

        if (
            Build.VERSION.SDK_INT >=
            Build.VERSION_CODES.M
        ) {

            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerAtMillis,
                pendingIntent
            )

        } else {

            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                triggerAtMillis,
                pendingIntent
            )
        }
    }

    private fun cancelAlarm(
        context: Context,
        alarmManager: AlarmManager,
        action: String,
        requestCode: Int
    ) {

        val intent =
            Intent(
                context,
                AppIconAlarmReceiver::class.java
            ).apply {

                this.action = action
            }

        val pendingIntent =
            PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or
                    PendingIntent.FLAG_IMMUTABLE
            )

        alarmManager.cancel(
            pendingIntent
        )
    }
}