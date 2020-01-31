---
to: <%=name%>/build.yaml
unless_exists: true
---
resources:
- repo: self
queue:
  name: CK11-Linux-B1
  demands: npm

steps:


# app
- task: Npm@1
  displayName: 'Установка пакетов приложения'
  inputs:
    command: custom

    workingDir: './'

    verbose: false

    customCommand: 'i'

- task: Npm@1
  displayName: 'Сборка приложения'
  inputs:
    command: custom

    workingDir: './'

    verbose: false

    customCommand: 'run build:release'
#end app

# endapp
- task: ArchiveFiles@2
  displayName: 'Архивирование приложения'
  inputs:
    rootFolderOrFile: ./dist

    includeRootFolder: false

    archiveFile: ../a/$(Build.DefinitionName).$(Build.BuildNumber).zip


- task: CmdLine@1
  displayName: 'Deploy'
  inputs:
    filename: python

    arguments: '/home/administrator/.bin/smbcopy.py --share "//fs-ptg/$(targetFolder)/" --rpath "CK-11 v$(Build.SourceBranchName)/Web"'

    workingFolder: ../a


