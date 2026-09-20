package com.ecommerceapp.appicon

import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager

object AppIconSwitcher {

    private const val DEFAULT_ALIAS =
        "com.ecommerceapp.DefaultIcon"

    private const val PROMOTIONAL_ALIAS =
        "com.ecommerceapp.PromotionalIcon"

    fun setIcon(
        context: Context,
        iconName: String?
    ) {
        val packageManager = context.packageManager

        val defaultComponent = ComponentName(
            context,
            DEFAULT_ALIAS
        )

        val promotionalComponent = ComponentName(
            context,
            PROMOTIONAL_ALIAS
        )

        if (iconName == "PromotionalIcon") {

            packageManager.setComponentEnabledSetting(
                promotionalComponent,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP
            )

            packageManager.setComponentEnabledSetting(
                defaultComponent,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )

        } else {

            packageManager.setComponentEnabledSetting(
                defaultComponent,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP
            )

            packageManager.setComponentEnabledSetting(
                promotionalComponent,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )
        }
    }
}