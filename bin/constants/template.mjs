const ROOT_TEMPLATE = [
  {
    folderName: "assets",
    path: "",
    type: "root"
  },
    {
        folderName: "screens",
        path: "lib",
        type: "root",
        files: [{
            fileName: "splash.screen.dart",
            path: "lib/screens",
            content: `import 'package:flutter/material.dart';

            class SplashScreen extends StatefulWidget {
              const SplashScreen({super.key});
            
              @override
              State<SplashScreen> createState() => _SplashScreenState();
            }
            
            class _SplashScreenState extends State<SplashScreen> {
              @override
              Widget build(BuildContext context) {
                return const Placeholder();
              }
            }`
        }]
    },
    {
      folderName: "constants",
      path: "lib",
      type: "root",
      files: [{
        fileName: "sample.constant.dart",
        path: "lib/constants/",
        content: "",
      }]
    },
    {
      folderName: "types",
      path: "lib",
      type: "root",
      files: [{
        fileName: "sample.type.dart",
        path: "lib/types/",
        content: "",
      }]
    },
    {
      folderName: "constants",
      type: "child"
    },
    {
      folderName: "screens",
      path: "lib",
      type: "child",
      files: [{
        fileName: "sample.screens.dart",
        path: "lib/screens",
        exportFrom: "screens",
        content: `import 'package:flutter/material.dart';

            class SampleScreen extends StatefulWidget {
              const SampleScreen({super.key});
            
              @override
              State<SampleScreen> createState() => _SampleScreenState();
            }
            
            class _SampleScreenState extends State<SampleScreen> {
              @override
              Widget build(BuildContext context) {
                return const Placeholder();
              }
            }`
      }]
    },
    {
      folderName: "services",
      type: "child"
    },
    {
      folderName: "utils",
      type: "child"
    },
    {
      folderName: "widgets",
      type: "child"
    },
    {
      folderName: "types",
      type: "child"
    }
];

export default ROOT_TEMPLATE;