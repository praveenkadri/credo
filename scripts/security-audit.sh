#!/bin/sh
set +e

echo "Phase 4A security audit report"
echo "Generated: $(date)"
echo

run_check() {
  label="$1"
  pattern="$2"
  paths="$3"

  echo "== $label =="
  # Report-only: matches need human review because historical migrations and
  # checklist docs may intentionally mention banned strings.
  rg -n "$pattern" $paths 2>/dev/null || echo "No matches."
  echo
}

run_check "Policies granting anon access: to anon" "to anon" "supabase app lib components hooks"
run_check "Anon role checks" "auth\\.role\\(\\)\\s*=\\s*'anon'" "supabase app lib components hooks"
run_check "Service role strings" "SERVICE_ROLE|service_role" "app components hooks lib supabase"
run_check "localStorage in sensitive paths" "localStorage" "app components hooks lib/data lib/supabase lib/auth"
run_check "SIN usage" "\\bsin\\b|sin_|SIN|social_insurance|full_sin|sin_number" "app components hooks lib supabase"
run_check "file_url/public document assumptions" "file_url|publicUrl|getPublicUrl|public.*documents|documents.*public" "app components hooks lib supabase"

echo "Review complete. This script is report-only and does not fail the build."
exit 0
