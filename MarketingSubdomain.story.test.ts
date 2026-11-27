import {it} from '@effect/vitest'

import {Story} from '@alchemy.run/domain/Story'

import {DeepTrackTasks} from '../DeepTrackTasks.model.ts'
import {CompleteFocus, FocusCompleted} from '../Focus/CompleteFocus.command.ts'
import {FocusSession} from '../Focus/FocusSession.aggregate.ts'
import {FocusStarted, StartFocus} from '../Focus/StartFocus.command.ts'
import {AddComment, CommentAdded} from '../Issue/AddComment.command.ts'
import {AttachFile, AttachmentAdded} from '../Issue/AttachFile.command.ts'
import {CreateIssue, IssueCreated} from '../Issue/CreateIssue.command.ts'
import {Issue} from '../Issue/Issue.aggregate.ts'
import {IssueStatusChanged, MoveIssue} from '../Issue/MoveIssue.command.ts'
import {IssueUpdated, UpdateIssue} from '../Issue/UpdateIssue.command.ts'

const story = Story.make(DeepTrackTasks)

it.effect('Setup marketing subdomain for Brevo email marketing', () => {
	const issue = Issue.ref('issue-marketing-subdomain')
	const focus = FocusSession.ref('focus-marketing-subdomain')
	const payload = {
		title: 'Setup marketing subdomain for Brevo email marketing',
		description: 'Delegate the marketing subdomain to Brevo and verify DNS.',
		priority: 'high' as const,
		assignee: 'dev@example.com',
		project: 'marketing',
		startDate: '2026-11-27T00:00:00.000Z',
		dueDate: '2026-11-27T23:59:59.000Z',
		tags: [{text: 'Marketing', color: 'bg-blue-50 text-blue-700 border-blue-200'}],
		expectedOutcome: 'Brevo can send email from the marketing subdomain.',
		acceptanceCriteria: ['Brevo DNS records are verified.'],
		story: null,
		at: '2026-11-27T09:00:00.000Z'
	}
	const comment = {
		id: 'comment-marketing-subdomain',
		author: 'Dev',
		authorEmail: 'dev@example.com',
		text: 'Brevo subdomain setup started.',
		createdAt: '2026-11-27T10:10:00.000Z'
	}
	const attachment = {
		r2Key: 'attachments/brevo-dns.txt',
		name: 'brevo-dns.txt',
		type: 'text/plain',
		size: 256
	}

	return story(
		Story.when(issue, new CreateIssue(payload)),
		Story.then(issue, new IssueCreated({...payload, status: 'backlog'})),
		Story.when(
			issue,
			new UpdateIssue({
				verificationNote: 'Brevo DNS checks passed.',
				at: '2026-11-27T10:00:00.000Z'
			})
		),
		Story.then(
			issue,
			new IssueUpdated({
				verificationNote: 'Brevo DNS checks passed.',
				at: '2026-11-27T10:00:00.000Z'
			})
		),
		Story.when(
			focus,
			new StartFocus({
				taskId: 'issue-marketing-subdomain',
				user: 'dev@example.com',
				mode: 'focus',
				startedAt: '2026-11-27T10:05:00.000Z'
			})
		),
		Story.then(
			focus,
			new FocusStarted({
				taskId: 'issue-marketing-subdomain',
				user: 'dev@example.com',
				mode: 'focus',
				startedAt: '2026-11-27T10:05:00.000Z'
			})
		),
		Story.when(issue, new AddComment({comment})),
		Story.then(issue, new CommentAdded({comment})),
		Story.when(issue, new AttachFile({attachment, at: '2026-11-27T10:15:00.000Z'})),
		Story.then(issue, new AttachmentAdded({attachment, at: '2026-11-27T10:15:00.000Z'})),
		Story.when(focus, new CompleteFocus({endedAt: '2026-11-27T10:30:00.000Z', durationMs: 1_500_000})),
		Story.then(focus, new FocusCompleted({endedAt: '2026-11-27T10:30:00.000Z', durationMs: 1_500_000})),
		Story.when(issue, new MoveIssue({to: 'ready', at: '2026-11-27T10:35:00.000Z'})),
		Story.then(issue, new IssueStatusChanged({from: 'backlog', to: 'ready', at: '2026-11-27T10:35:00.000Z'}))
	)
})
