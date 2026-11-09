pluginManagement { repositories { google(); mavenCentral(); maven("https://maven.aliyun.com/repository/google"); maven("https://maven.aliyun.com/repository/central"); google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositories { google(); mavenCentral(); maven("https://maven.aliyun.com/repository/google"); maven("https://maven.aliyun.com/repository/central"); google(); mavenCentral() } }
rootProject.name = "NonamePocket"
include(":app")
