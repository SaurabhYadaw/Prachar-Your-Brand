#!/usr/bin/env ruby
require 'net/http'
require 'uri'
require 'json'
require 'base64'

TOKEN = ENV['GITHUB_TOKEN']
REPO = "SaurabhYadaw/Prachar-Your-Brand"

if TOKEN.nil? || TOKEN.empty?
  puts "ERROR: GITHUB_TOKEN environment variable is not set."
  puts "Please run: GITHUB_TOKEN='your_token_here' ruby push_to_github.rb"
  exit 1
end

def github_request(endpoint, method = :get, body = nil)
  uri = URI("https://api.github.com/repos/#{REPO}#{endpoint}")
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.read_timeout = 60

  req = case method
        when :get then Net::HTTP::Get.new(uri)
        when :post then Net::HTTP::Post.new(uri)
        when :patch then Net::HTTP::Patch.new(uri)
        when :put then Net::HTTP::Put.new(uri)
        end

  req['Authorization'] = "Bearer #{TOKEN}"
  req['Accept'] = "application/vnd.github+json"
  req['X-GitHub-Api-Version'] = "2022-11-28"
  req['User-Agent'] = "PYB-Uploader"
  req['Content-Type'] = "application/json" if body

  req.body = body.to_json if body

  res = http.request(req)
  if res.code.to_i >= 400
    raise "GitHub API error (#{res.code}) on #{method.upcase} #{endpoint}: #{res.body}"
  end
  JSON.parse(res.body) rescue res.body
end

puts "Connecting to GitHub repository: #{REPO}..."
repo_info = github_request("")
puts "Repository connected: #{repo_info['full_name']} (Default branch: #{repo_info['default_branch'] || 'main'})"

# Collect all files to push (excluding ignored files)
excluded_prefixes = [
  "chhayachitrakar",
  "PYB_all_video_frames",
  ".git"
]

files = Dir.glob("**/*", File::FNM_DOTMATCH).select do |f|
  next false unless File.file?(f)
  next false if f.include?(".DS_Store")
  next false if f.end_with?(".zip")
  next false if f.include?("Social Spark Co")
  next false if f.start_with?("push_to_github.rb")
  next false if f.start_with?("hero_person_backup.jpg")
  next false if excluded_prefixes.any? { |prefix| f.start_with?(prefix) }
  true
end

puts "Found #{files.size} project files to upload to GitHub."

tree_items = []
files.each_with_index do |file_path, idx|
  file_size = File.size(file_path)
  # GitHub blob API limit is 100MB; our largest web file is ~21MB
  print "[#{idx + 1}/#{files.size}] Uploading #{file_path} (#{(file_size / 1024.0).round(1)} KB)... "
  $stdout.flush

  content_b64 = Base64.strict_encode64(File.binread(file_path))
  blob_res = github_request("/git/blobs", :post, {
    content: content_b64,
    encoding: "base64"
  })

  tree_items << {
    path: file_path,
    mode: "100644",
    type: "blob",
    sha: blob_res["sha"]
  }
  puts "OK (SHA: #{blob_res['sha'][0..7]})"
end

puts "\nCreating Git Tree with #{tree_items.size} files..."
tree_res = github_request("/git/trees", :post, { tree: tree_items })
tree_sha = tree_res["sha"]
puts "Tree created: #{tree_sha}"

# Check for existing commit on main branch
branch_name = repo_info['default_branch'] || 'main'
parent_shas = []
begin
  ref_res = github_request("/git/ref/heads/#{branch_name}")
  parent_shas = [ref_res["object"]["sha"]]
  puts "Existing commit on #{branch_name}: #{parent_shas[0]}"
rescue => e
  puts "Branch #{branch_name} is fresh (no parent commit)."
end

puts "Creating commit..."
commit_res = github_request("/git/commits", :post, {
  message: "PYB – Prachar Your Brand: Multi-page marketing agency website",
  tree: tree_sha,
  parents: parent_shas
})
commit_sha = commit_res["sha"]
puts "Commit created: #{commit_sha}"

puts "Updating branch #{branch_name} to point to new commit..."
begin
  github_request("/git/refs/heads/#{branch_name}", :patch, {
    sha: commit_sha,
    force: true
  })
rescue => e
  # If ref did not exist, create it
  github_request("/git/refs", :post, {
    ref: "refs/heads/#{branch_name}",
    sha: commit_sha
  })
end

puts "\n========================================================"
puts "SUCCESS! All files have been pushed to:"
puts "https://github.com/#{REPO}"
puts "========================================================"
