#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface AppIconManager : NSObject <RCTBridgeModule>
@end

@implementation AppIconManager

RCT_EXPORT_MODULE(AppIconManager);

RCT_REMAP_METHOD(
  setIcon,
  setIcon:(NSString *)iconName
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIApplication *application = [UIApplication sharedApplication];

    if (![application supportsAlternateIcons]) {
      reject(
        @"ICON_NOT_SUPPORTED",
        @"Alternate app icons are not supported.",
        nil
      );
      return;
    }

    [application setAlternateIconName:iconName
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