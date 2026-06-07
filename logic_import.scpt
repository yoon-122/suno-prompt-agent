-- ============================================================================
-- Suno Agent → Logic Pro Import Helper
--
-- 지정한 폴더 안의 오디오 파일(mp3/wav/aif/aiff/m4a/caf)을 파일명 순서대로
-- Logic Pro로 가져옵니다 (메뉴: File > Import > Audio File…).
--
-- 준비물
--   1) 시스템 설정 → 개인정보 보호 및 보안 → 손쉬운 사용(Accessibility)에서
--      터미널(또는 osascript를 실행하는 앱)에 권한을 허용하세요.
--      이 스크립트는 Logic Pro의 메뉴를 자동으로 클릭하는 GUI 자동화(System
--      Events)를 사용하기 때문에 이 권한이 반드시 필요합니다.
--   2) Logic Pro에서 오디오를 가져올 프로젝트를 먼저 열어 두세요.
--      (이 스크립트는 새 프로젝트를 만들지 않고, 현재 열려 있는 프로젝트를 사용합니다)
--   3) 파일이 원하는 순서대로 정렬되도록 "01_intro.wav, 02_verse.wav…"처럼
--      이름 앞에 번호를 붙여두는 것을 권장합니다 (이름 가나다/알파벳 순으로 처리됩니다).
--
-- 실행 방법 (터미널에서)
--   osascript ~/Desktop/suno-agent/logic_import.scpt "/Users/사용자이름/Desktop/폴더이름"
--   (경로를 생략하고 실행하면 직접 입력할 수 있는 대화상자가 뜹니다)
--
-- 참고
--   Logic Pro의 메뉴 이름과 구조는 버전 / macOS 언어 설정에 따라 달라질 수
--   있습니다. 자동화가 정확히 동작하지 않는다면 아래 importAudioFile 핸들러의
--   메뉴 경로(File → Import → Audio File…)를 사용 환경에 맞게 수정하세요.
-- ============================================================================

on run argv
	set targetPath to ""
	if (count of argv) > 0 then
		set targetPath to item 1 of argv
	else
		try
			set dialogResult to display dialog "오디오 파일이 들어있는 폴더의 전체 경로를 입력하세요:" default answer (POSIX path of (path to desktop folder))
			set targetPath to text returned of dialogResult
		on error number -128
			return
		end try
	end if

	if targetPath ends with "/" then
		set targetPath to text 1 thru -2 of targetPath
	end if

	set audioExtensions to {"mp3", "wav", "aif", "aiff", "m4a", "caf"}

	-- `ls -1`은 폴더 안의 항목을 한 줄에 하나씩, 이름 순으로 정렬해 돌려줍니다.
	set fileListText to do shell script "ls -1 " & quoted form of targetPath
	set fileNames to paragraphs of fileListText

	set audioFiles to {}
	repeat with oneName in fileNames
		set oneName to oneName as string
		if my hasAudioExtension(oneName, audioExtensions) then
			set end of audioFiles to (targetPath & "/" & oneName)
		end if
	end repeat

	if (count of audioFiles) is 0 then
		display dialog "다음 폴더에서 오디오 파일을 찾지 못했습니다:" & return & targetPath buttons {"확인"} default button 1
		return
	end if

	tell application "Logic Pro" to activate
	delay 2

	set importedCount to 0
	repeat with filePath in audioFiles
		try
			my importAudioFile(filePath as string)
			set importedCount to importedCount + 1
			delay 1.5
		on error errMsg
			log "가져오기 실패: " & filePath & " — " & errMsg
		end try
	end repeat

	display notification ((importedCount as string) & " / " & ((count of audioFiles) as string) & "개 파일의 가져오기를 시도했습니다.") with title "Suno Agent → Logic Pro"
end run

-- 파일 이름의 확장자가 오디오 확장자 목록에 있는지 확인 (대소문자 구분 없음)
on hasAudioExtension(fileName, extensionList)
	set AppleScript's text item delimiters to "."
	set nameParts to text items of fileName
	set AppleScript's text item delimiters to ""
	if (count of nameParts) < 2 then return false
	set ext to item -1 of nameParts as string
	repeat with validExt in extensionList
		if ext is validExt then return true
	end repeat
	return false
end hasAudioExtension

-- File > Import > Audio File… 메뉴를 열고, 열기 패널에 경로를 직접 입력해 가져오기
on importAudioFile(posixPath)
	tell application "System Events"
		tell process "Logic Pro"
			set frontmost to true
			click menu bar item "File" of menu bar 1
			delay 0.3
			click menu item "Import" of menu 1 of menu bar item "File" of menu bar 1
			delay 0.3
			click menu item "Audio File…" of menu 1 of menu item "Import" of menu 1 of menu bar item "File" of menu bar 1
			delay 1
			-- "이동(Go to Folder)" 단축키로 파일 경로를 직접 입력해 선택
			keystroke "g" using {command down, shift down}
			delay 0.6
			keystroke posixPath
			delay 0.4
			keystroke return
			delay 0.8
			keystroke return
		end tell
	end tell
end importAudioFile
