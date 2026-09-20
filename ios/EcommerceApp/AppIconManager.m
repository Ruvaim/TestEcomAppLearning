#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface AppIconManager : NSObject <RCTBridgeModule>
@end

@implementation AppIconManager

RCT_EXPORT_MODULE(AppIconManager);

RCT_EXPORT_METHOD(setIcon:(NSString *)iconName
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIApplication *application = [UIApplication sharedApplication];

    if (![application supportsAlternateIcons]) {
      reject(
        @"ICON_NOT_SUPPORTED",
        @"Alternate app icons are not supported on this device.",
        nil
      );
      return;
    }

    // nil restores the primary/default icon.
    NSString *alternateIconName = iconName.length > 0 ? iconName : nil;

    [application setAlternateIconName:alternateIconName
                    completionHandler:^(NSError *error) {
      if (error) {
        reject(
          @"ICON_CHANGE_FAILED",
          error.localizedDescription,
          error
        );
        return;
      }

      resolve(@YES);
    }];
  });
}

@end