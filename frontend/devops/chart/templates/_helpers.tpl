{{- define "tms-frontend.fullname" -}}
{{- .Release.Name | printf "%s-%s" .Chart.Name }}
{{- end }}

{{- define "tms-frontend.labels" -}}
app: {{ include "tms-frontend.fullname" . }}
{{- end }}

{{- define "tms-frontend.selectorLabels" -}}
app: {{ include "tms-frontend.fullname" . }}
{{- end }}
